import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Alert, FlatList, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/auth.styles';

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
  // Guardamos un objeto Date real para el DatePicker
  const [fechaFin, setFechaFin] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  
  const [lista, setLista] = useState<Tarea[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  // Manejador del cambio de fecha
  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || fechaFin;
    setShowPicker(Platform.OS === 'ios'); // En iOS se mantiene abierto, en Android se cierra
    setFechaFin(currentDate);
  };

  const agregar_o_actualizar = () => {
    if (tarea.length === 0) return;

    // Formateamos la fecha para mostrarla como string en la lista
    const fechaFormateada = `${fechaFin.getDate()}/${fechaFin.getMonth() + 1}/${fechaFin.getFullYear()}`;

    if (editandoId) {
      setLista(lista.map((item) => 
        item.id === editandoId 
          ? { ...item, valor: tarea, descripcion, fecha_terminacion: fechaFormateada }
          : item
      ));
      setEditandoId(null);
    } else {
      setLista([...lista, {
        id: Date.now().toString(),
        valor: tarea,
        descripcion: descripcion,
        fecha_inicio: new Date().toLocaleDateString(),
        fecha_terminacion: fechaFormateada
      }]);
    }
    limpiarFormulario();
  };

  const prepararEdicion = (item: Tarea) => {
    setEditandoId(item.id);
    setTarea(item.valor);
    setDescripcion(item.descripcion);
    
    // Intentar reconstruir la fecha para el picker al editar
    try {
        const [d, m, a] = item.fecha_terminacion.split('/').map(Number);
        if (d && m && a) {
            setFechaFin(new Date(a, m - 1, d));
        } else {
            setFechaFin(new Date());
        }
    } catch (e) {
        setFechaFin(new Date());
    }
  };

  const limpiarFormulario = () => {
    setTarea(''); setDescripcion(''); setFechaFin(new Date()); setEditandoId(null);
  };

  const confirmarEliminar = (id: string) => {
    Alert.alert(
        "Eliminar Tarea",
        "¿Estás seguro de que deseas borrar esta tarea?",
        [
            { text: "Cancelar", style: "cancel" },
            { text: "Eliminar", onPress: () => setLista(lista.filter(t => t.id !== id)), style: "destructive" }
        ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{editandoId ? "Editar Tarea" : "Nueva Tarea"}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre de la tarea</Text>
        <TextInput style={styles.input} value={tarea} onChangeText={setTarea} placeholder='Ej. Estudiar React' placeholderTextColor="#5A4E8A" />
        
        <Text style={styles.label}>Descripción</Text>
        <TextInput style={styles.input} value={descripcion} onChangeText={setDescripcion} placeholder='Detalles...' placeholderTextColor="#5A4E8A" />

        {/* --- SECCIÓN DEL CALENDARIO --- */}
        <Text style={styles.label}>Fecha de finalización</Text>
        <TouchableOpacity 
            style={[styles.input, { justifyContent: 'center', height: 50 }]} 
            onPress={() => setShowPicker(true)}
        >
          <Text style={{ color: '#5A4E8A' }}>
            {fechaFin.toLocaleDateString()} 📅
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
      </View>

      <TouchableOpacity 
        style={[styles.iniciarSesion, { backgroundColor: editandoId ? '#4CAF50' : '#6C55D4', marginTop: 20 }]} 
        onPress={agregar_o_actualizar}
      >
        <Text style={styles.textoActivo}>{editandoId ? "GUARDAR CAMBIOS" : "AGREGAR TAREA"}</Text>
      </TouchableOpacity>

      {editandoId && (
        <TouchableOpacity onPress={limpiarFormulario} style={{ marginTop: 10, alignItems: 'center' }}>
          <Text style={{ color: '#FF4444' }}>Cancelar Edición</Text>
        </TouchableOpacity>
      )}

      <FlatList 
        data={lista} 
        keyExtractor={(item) => item.id} 
        style={{ width: '100%', marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={[styles.infoBox, { marginBottom: 15 }]}>
            <Text style={[styles.label, {color: '#7B6EB0'}]}>Tarea</Text>
            <Text style={styles.value}>{item.valor}</Text>
            
            {/* --- AQUÍ ESTÁ LA CORRECCIÓN: MOSTRAR DESCRIPCIÓN --- */}
            {item.descripcion.length > 0 && (
                <>
                    <Text style={[styles.label, {marginTop: 10, color: '#7B6EB0'}]}>Descripción</Text>
                    <Text style={[styles.description, {textAlign: 'left', color: '#fff'}]}>{item.descripcion}</Text>
                </>
            )}
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, borderTopWidth: 0.5, borderTopColor: '#3D3070', paddingTop: 10 }}>
                <Text style={{ color: '#7B6EB0', fontSize: 11 }}>Inicio: {item.fecha_inicio}</Text>
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>Límite: {item.fecha_terminacion}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15, gap: 10 }}>
                <TouchableOpacity 
                    onPress={() => prepararEdicion(item)} 
                    style={{ paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#3D3070', borderRadius: 5 }}
                >
                    <Text style={{ color: '#fff', fontSize: 12 }}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => confirmarEliminar(item.id)} 
                    style={{ paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#442222', borderRadius: 5 }}
                >
                    <Text style={{ color: '#FF8888', fontSize: 12 }}>Borrar</Text>
                </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}