import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { styles } from '../../styles/auth.styles';

export default function Register() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  // Paso 1: Crear la cuenta y enviar correo
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      Alert.alert("Error", err.errors[0].message);
    }
  };

  // Paso 2: Verificar el código
  const onPressVerify = async () => {
    if (!isLoaded) return;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/(tabs)/main');
      }
    } catch (err: any) {
      Alert.alert("Error de Verificación", err.errors[0].message);
    }
  };

  return (
    <View style={styles.container}>
      {!pendingVerification ? (
        <View style={styles.card}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput 
            autoCapitalize="none" 
            value={emailAddress} 
            placeholder="email@itlp.edu.mx" 
            style={styles.input} 
            onChangeText={setEmailAddress} 
          />
          <Text style={styles.label}>Contraseña</Text>
          <TextInput 
            value={password} 
            secureTextEntry 
            style={styles.input} 
            onChangeText={setPassword} 
          />
          <TouchableOpacity style={styles.iniciarSesion} onPress={onSignUpPress}>
            <Text style={{ color: "white" }}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.label}>Ingresa el código enviado a tu correo</Text>
          <TextInput 
            value={code} 
            placeholder="Código..." 
            style={styles.input} 
            onChangeText={setCode} 
          />
          <TouchableOpacity style={styles.iniciarSesion} onPress={onPressVerify}>
            <Text style={{ color: "white" }}>Verificar Correo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}