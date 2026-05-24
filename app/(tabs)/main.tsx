import { useAuth } from "@clerk/clerk-expo"; // Importamos el hook de Clerk
import { Link } from 'expo-router';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export default function Main() {
  const { signOut } = useAuth(); // Obtenemos la función para cerrar sesión

  const handleSignOut = async () => {
    try {
      await signOut();
      // No necesitas hacer un router.replace aquí, 
      // tu InitialLayout lo hará automáticamente.
    } catch (err) {
      Alert.alert("Error", "No se pudo cerrar la sesión");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Pantalla Principal</Text>

      <View style={{ gap: 10 }}>
        <Link href="/profile">
          <Text style={{ color: 'blue' }}>Ir a Profile</Text>
        </Link>
        <Link href="/bookmark">
          <Text style={{ color: 'blue' }}>Ir a Bookmark</Text>
        </Link>
        <Link href="/notifications">
          <Text style={{ color: 'blue' }}>Ir a Notifications</Text>
        </Link>
      </View>

      {/* Botón de Cerrar Sesión */}
      <TouchableOpacity 
        onPress={handleSignOut}
        style={{
          backgroundColor: '#FF3B30', // Rojo para indicar salida
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 25,
          marginTop: 50
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}