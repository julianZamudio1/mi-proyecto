import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { styles } from '../../styles/auth.styles';

export default function HomeScreen() {
  const { user } = useUser();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isLargeScreen = width > 600;
  const cardWidth = isLargeScreen ? 500 : '100%';

  const accesos = [
    { label: 'Muro de Fotos', icon: '📸', route: '/(tabs)/feed' },
    { label: 'Mis Tareas', icon: '📋', route: '/(tabs)/tareas' },
    { label: 'Marcadores', icon: '🔖', route: '/(tabs)/marcadores' },
    { label: 'Notificaciones', icon: '🔔', route: '/(tabs)/notificaciones' },
  ];

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingHorizontal: isLargeScreen ? 0 : 22, paddingTop: 24 },
      ]}
    >
      {/* Saludo */}
      <View style={{ width: cardWidth, marginBottom: 20 }}>
        <Text style={[styles.title, { textAlign: 'left', fontSize: 22 }]}>
          Hola, {user?.firstName || 'Bienvenido'} 👋
        </Text>
        <Text style={[styles.subtitle, { textAlign: 'left', marginBottom: 0 }]}>
          ¿Qué quieres hacer hoy?
        </Text>
      </View>

      {/* Tarjeta de perfil */}
      <View style={[styles.card, { width: cardWidth, flexDirection: 'row', alignItems: 'center', gap: 14 }]}>
        <Image
          source={{ uri: user?.imageUrl || 'https://via.placeholder.com/150' }}
          style={{ width: 58, height: 58, borderRadius: 29, borderWidth: 2, borderColor: '#4A3AAA' }}
        />
        <View style={{ flex: 1 }}>
          <Text style={[styles.value, { fontSize: 15 }]}>{user?.fullName || 'Usuario'}</Text>
          <Text style={{ color: '#7B6EB0', fontSize: 12, marginTop: 2 }}>
            {user?.primaryEmailAddress?.emailAddress || ''}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#4CAF50', marginRight: 5 }} />
            <Text style={{ color: '#4CAF50', fontSize: 11 }}>En línea</Text>
          </View>
        </View>
      </View>

      {/* Accesos rápidos */}
      <View style={{ width: cardWidth, marginTop: 8 }}>
        <Text style={[styles.label, { marginBottom: 10, fontSize: 11 }]}>ACCESOS RÁPIDOS</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {accesos.map((item) => (
            <TouchableOpacity
              key={item.route}
              onPress={() => router.push(item.route as any)}
              style={{
                width: '47%',
                backgroundColor: '#2A1F5C',
                borderRadius: 14,
                borderWidth: 0.5,
                borderColor: '#3D3070',
                padding: 18,
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Text style={{ fontSize: 28 }}>{item.icon}</Text>
              <Text style={{ color: '#EDE9FB', fontSize: 13, fontWeight: '500' }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Banner informativo */}
      <View style={[styles.card, {
        width: cardWidth,
        marginTop: 16,
        backgroundColor: '#3D2F8A',
        borderColor: '#6C55D4',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }]}>
        <Text style={{ fontSize: 28 }}>🎓</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.value, { fontSize: 13 }]}>Tu espacio escolar</Text>
          <Text style={{ color: '#9B8FCE', fontSize: 12, marginTop: 2, lineHeight: 18 }}>
            Organiza tus tareas, comparte fotos y mantente al día con tus notificaciones.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}