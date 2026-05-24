import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { styles } from '../../styles/auth.styles';

export const NOTIF_KEY = '@notificaciones';

export interface Notificacion {
  id: string;
  tipo: 'foto' | 'tarea';
  titulo: string;
  mensaje: string;
  creadaEn: string;
  leida: boolean;
}

// Función utilitaria exportada para agregar notificaciones desde otras pestañas
export async function agregarNotificacion(notif: Omit<Notificacion, 'id' | 'creadaEn' | 'leida'>) {
  const data = await AsyncStorage.getItem(NOTIF_KEY);
  const actuales: Notificacion[] = data ? JSON.parse(data) : [];
  const nueva: Notificacion = {
    ...notif,
    id: Date.now().toString(),
    creadaEn: new Date().toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' }),
    leida: false,
  };
  const actualizado = [nueva, ...actuales];
  await AsyncStorage.setItem(NOTIF_KEY, JSON.stringify(actualizado));
}

export default function Notificaciones() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 600;
  const cardWidth = isLargeScreen ? 500 : '100%';

  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  // Se recarga cada vez que el usuario entra a esta pestaña
  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(NOTIF_KEY).then((data) => {
        if (data) setNotificaciones(JSON.parse(data));
      });
    }, [])
  );

  const marcarTodasLeidas = async () => {
    const actualizadas = notificaciones.map((n) => ({ ...n, leida: true }));
    setNotificaciones(actualizadas);
    await AsyncStorage.setItem(NOTIF_KEY, JSON.stringify(actualizadas));
  };

  const eliminarTodas = async () => {
    setNotificaciones([]);
    await AsyncStorage.removeItem(NOTIF_KEY);
  };

  const marcarLeida = async (id: string) => {
    const actualizadas = notificaciones.map((n) => n.id === id ? { ...n, leida: true } : n);
    setNotificaciones(actualizadas);
    await AsyncStorage.setItem(NOTIF_KEY, JSON.stringify(actualizadas));
  };

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  const iconoPorTipo = (tipo: 'foto' | 'tarea') => tipo === 'foto' ? '📸' : '📋';
  const colorPorTipo = (tipo: 'foto' | 'tarea') => tipo === 'foto' ? '#4A3AAA' : '#2E7D32';

  return (
    <View style={[styles.container, { paddingHorizontal: isLargeScreen ? 0 : 22, paddingTop: 20 }]}>

      {/* Header */}
      <View style={{ width: cardWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <View>
          <Text style={[styles.title, { textAlign: 'left', fontSize: 20 }]}>
            🔔 Notificaciones
            {noLeidas > 0 && (
              <Text style={{ color: '#6C55D4', fontSize: 16 }}> ({noLeidas})</Text>
            )}
          </Text>
          <Text style={[styles.subtitle, { textAlign: 'left', marginBottom: 0 }]}>
            {notificaciones.length} en total
          </Text>
        </View>
        {notificaciones.length > 0 && (
          <View style={{ gap: 6 }}>
            <TouchableOpacity
              onPress={marcarTodasLeidas}
              style={{ backgroundColor: '#2A1F5C', borderRadius: 8, paddingVertical: 5, paddingHorizontal: 10, borderWidth: 0.5, borderColor: '#3D3070' }}
            >
              <Text style={{ color: '#7B6EB0', fontSize: 11 }}>✓ Leer todo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={eliminarTodas}
              style={{ backgroundColor: '#2A1F5C', borderRadius: 8, paddingVertical: 5, paddingHorizontal: 10, borderWidth: 0.5, borderColor: '#442222' }}
            >
              <Text style={{ color: '#FF8888', fontSize: 11 }}>🗑 Limpiar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={notificaciones}
        keyExtractor={(item) => item.id}
        style={{ width: '100%', maxWidth: 500 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Text style={{ fontSize: 44, marginBottom: 12 }}>🔕</Text>
            <Text style={styles.description}>No hay notificaciones todavía.</Text>
            <Text style={[styles.subtitle, { marginTop: 6 }]}>
              Aparecerán aquí cuando subas fotos o agregues tareas.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => marcarLeida(item.id)} activeOpacity={0.8}>
            <View style={[styles.card, {
              width: cardWidth,
              alignItems: 'stretch',
              flexDirection: 'row',
              gap: 12,
              borderLeftWidth: 3,
              borderLeftColor: item.leida ? '#3D3070' : colorPorTipo(item.tipo),
              opacity: item.leida ? 0.6 : 1,
            }]}>
              {/* Ícono */}
              <View style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: colorPorTipo(item.tipo),
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Text style={{ fontSize: 20 }}>{iconoPorTipo(item.tipo)}</Text>
              </View>

              {/* Contenido */}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={[styles.value, { fontSize: 13 }]}>{item.titulo}</Text>
                  {!item.leida && (
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#6C55D4' }} />
                  )}
                </View>
                <Text style={{ color: '#9B8FCE', fontSize: 12, marginTop: 3, lineHeight: 17 }}>{item.mensaje}</Text>
                <Text style={{ color: '#7B6EB0', fontSize: 10, marginTop: 5 }}>🕐 {item.creadaEn}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}