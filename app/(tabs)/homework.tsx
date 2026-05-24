import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Alert, FlatList, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/auth.styles';
import { agregarNotificacion } from './notifications';

interface Tarea {
  id: string;
  valor: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_terminacion: string;
}

export default function Homework() {
  const [tarea, setTarea] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaFin, setFechaFin] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [lista, setLista] = useState<Tarea[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || fechaFin;
    setShowPicker(Platform.OS === 'ios');
    setFechaFin(currentDate);
  };

  const agregar_o_actualizar = async () => {
    if (tarea.length === 0) return;

    const fechaFormateada = `${fechaFin.getDate()}/${fechaFin.getMonth() + 1}/${fechaFin.getFullYear()}`;

    if (editandoId) {
      setLista(lista.map((item) =>
        item.id === editandoId
          ? { ...item, valor: tarea, descripcion, fecha_terminacion: fechaFormateada }
          : item
      ));
      setEditandoId(null);
    } else {
      const nuevaTarea: Tarea = {
        id: Date.now().toString(),
        valor: tarea,
        descripcion,
        fecha_inicio: new Date().toLocaleDateString(),
        fecha_terminacion: fechaFormateada,
      };
      setLista((prev) => [...prev, nuevaTarea]);

      // ✅ Notificación de nueva tarea
      await agregarNotificacion({
        tipo: 'tarea',
        titulo: 'Nueva tarea agregada',
        mensaje: `"${tarea}" con fecha límite el ${fechaFormateada}.`,
      });
    }

    limpiarFormulario();
  };

  const prepararEdicion = (item: Tarea) => {
    setEditandoId(item.id);
    setTarea(item.valor);
    setDescripcion(item.descripcion);
    try {
      const [d, m, a] = item.fecha_terminacion.split('/').map(Number);
      if (d && m && a) setFechaFin(new Date(a, m - 1, d));
      else setFechaFin(new Date());
    } catch {
      setFechaFin(new Date());
    }
  };

  const limpiarFormulario = () => {
    setTarea('');
    setDescripcion('');
    setFechaFin(new Date());
    setEditandoId(null);
  };

  const confirmarEliminar = (id: string) => {
    Alert.alert(
      'Eliminar Tarea',
      '¿Estás seguro de que deseas borrar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => setLista(lista.filter((t) => t.id !== id)),
        },
      ]
    );
  };

  // Colores según proximidad de fecha
  const colorFecha = (fechaStr: string) => {
    try {
      const [d, m, a] = fechaStr.split('/').map(Number);
      const fecha = new Date(a, m - 1, d);
      const hoy = new Date();
      const diff = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
      if (diff < 0) return '#FF4444';   // vencida
      if (diff <= 3) return '#FF9800';  // urgente
      return '#4CAF50';                 // ok
    } catch {
      return '#7B6EB0';
    }
  };

  const etiquetaFecha = (fechaStr: string) => {
    try {
      const [d, m, a] = fechaStr.split('/').map(Number);
      const fecha = new Date(a, m - 1, d);
      const hoy = new Date();
      const diff = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
      if (diff < 0) return '⚠️ Vencida';
      if (diff === 0) return '🔴 Hoy';
      if (diff === 1) return '🟠 Mañana';
      if (diff <= 3) return `🟠 ${diff} días`;
      return `🟢 ${diff} días`;
    } catch {
      return '';
    }
  };

  return (
    <View style={styles.container}>

      {/* Encabezado */}
      <View style={{ width: '100%', maxWidth: 500, marginBottom: 12 }}>
        <Text style={[styles.title, { textAlign: 'left', fontSize: 20 }]}>
          {editandoId ? '✏️ Editar Tarea' : '📋 Mis Tareas'}
        </Text>
        <Text style={[styles.subtitle, { textAlign: 'left', marginBottom: 0 }]}>
          {lista.length} tarea{lista.length !== 1 ? 's' : ''} registrada{lista.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Formulario */}
      <View style={[styles.card, { width: '100%', maxWidth: 500 }]}>
        <Text style={styles.label}>Nombre de la tarea</Text>
        <TextInput
          style={styles.input}
          value={tarea}
          onChangeText={setTarea}
          placeholder="Ej. Estudiar React"
          placeholderTextColor="#5A4E8A"
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.input}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Detalles..."
          placeholderTextColor="#5A4E8A"
        />

        <Text style={styles.label}>Fecha de finalización</Text>
        <TouchableOpacity
          style={[styles.input, { justifyContent: 'center', height: 50 }]}
          onPress={() => setShowPicker(true)}
        >
          <Text style={{ color: '#EDE9FB' }}>
            📅 {fechaFin.toLocaleDateString('es-MX')}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={fechaFin}
            mode="date"
            display="calendar"
            onChange={onChangeDate}
            minimumDate={new Date()}
          />
        )}

        <TouchableOpacity
          style={[
            styles.iniciarSesion,
            {
              backgroundColor: editandoId ? '#2E7D32' : '#6C55D4',
              marginHorizontal: 14,
              marginTop: 8,
              marginBottom: 4,
            },
          ]}
          onPress={agregar_o_actualizar}
        >
          <Text style={styles.buttonText}>
            {editandoId ? '💾 Guardar cambios' : '+ Agregar tarea'}
          </Text>
        </TouchableOpacity>

        {editandoId && (
          <TouchableOpacity onPress={limpiarFormulario} style={{ alignItems: 'center', paddingVertical: 10 }}>
            <Text style={{ color: '#FF4444', fontSize: 13 }}>Cancelar edición</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de tareas */}
      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        style={{ width: '100%', maxWidth: 500, marginTop: 12 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>📭</Text>
            <Text style={styles.description}>No tienes tareas registradas.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.infoBox, {
            marginBottom: 12,
            borderLeftWidth: 3,
            borderLeftColor: colorFecha(item.fecha_terminacion),
          }]}>

            {/* Nombre */}
            <Text style={[styles.value, { fontSize: 15, marginBottom: 2 }]}>{item.valor}</Text>

            {/* Descripción */}
            {item.descripcion.length > 0 && (
              <Text style={{ color: '#9B8FCE', fontSize: 13, marginTop: 2, lineHeight: 18 }}>
                {item.descripcion}
              </Text>
            )}

            {/* Fechas */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 12,
              borderTopWidth: 0.5,
              borderTopColor: '#3D3070',
              paddingTop: 10,
            }}>
              <Text style={{ color: '#7B6EB0', fontSize: 11 }}>
                Inicio: {item.fecha_inicio}
              </Text>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: colorFecha(item.fecha_terminacion), fontSize: 11, fontWeight: 'bold' }}>
                  Límite: {item.fecha_terminacion}
                </Text>
                <Text style={{ color: colorFecha(item.fecha_terminacion), fontSize: 10, marginTop: 2 }}>
                  {etiquetaFecha(item.fecha_terminacion)}
                </Text>
              </View>
            </View>

            {/* Botones */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 8 }}>
              <TouchableOpacity
                onPress={() => prepararEdicion(item)}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 14,
                  backgroundColor: '#3D3070',
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#EDE9FB', fontSize: 12 }}>✏️ Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => confirmarEliminar(item.id)}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 14,
                  backgroundColor: '#442222',
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#FF8888', fontSize: 12 }}>🗑 Borrar</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}
      />
    </View>
  );
}