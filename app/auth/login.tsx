import { useOAuth, useSignIn } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Link, useRouter } from 'expo-router';
import * as WebBrowser from "expo-web-browser";
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/auth.styles';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();
  const { signIn, setActive: setSignInActive, isLoaded: isSignInLoaded } = useSignIn();
  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("Estudiantes");


  const onSignInEmail = async () => {
  if (!isSignInLoaded) return;
  try {
    
    console.log("Intentando login con:", email); 
    
    const completeSignIn = await signIn.create({
      identifier: email, 
      password: password,
    });
    
    await setSignInActive({ session: completeSignIn.createdSessionId });
  } catch (err: any) {
    console.error("Error detallado de Clerk:", JSON.stringify(err, null, 2));
    Alert.alert("Error de acceso", "Las credenciales son incorrectas o el usuario no existe.");
  }
};

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onGoogleSignIn = async () => {
    try {
      const redirectUrl = Linking.createURL("oauth-native-callback");
      const { createdSessionId, setActive } = await startOAuthFlow({ redirectUrl });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.log("OAuth error", err);
    }
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.animationContainer}>
        <LottieView
          autoPlay
          style={{ width: 200, height: 200 }}
          source={require('../assets/animacion.json')}
        />
      </View>

      {/* Selector de tipo de usuario */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 25,
        padding: 5
      }}>
        <TouchableOpacity
          style={[styles.botonMenu, tipoUsuario === "Estudiantes" && styles.botonActivo]}
          onPress={() => setTipoUsuario("Estudiantes")}
        >
          <Text style={[styles.text, tipoUsuario === "Estudiantes" && styles.textoActivo]}>
            Estudiantes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botonMenu, tipoUsuario === "Personal" && styles.botonActivo]}
          onPress={() => setTipoUsuario("Personal")}
        >
          <Text style={[styles.text, tipoUsuario === "Personal" && styles.textoActivo]}>
            Personal
          </Text>
        </TouchableOpacity>
      </View>

      {/* Formulario */}
      <View style={styles.card}>
        <Text style={styles.label}>
          {tipoUsuario === "Estudiantes" ? "Número de control o Correo" : "Usuario o Correo"}
        </Text>
        <TextInput 
          style={styles.input} 
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="ejemplo@gmail.com"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput 
          style={styles.input} 
          secureTextEntry 
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Botón de Inicio de Sesión Tradicional */}
      <TouchableOpacity style={styles.iniciarSesion} onPress={onSignInEmail}>
        <Text style={{ color: "white", textAlign: "center", fontWeight: 'bold' }}>
          Iniciar sesión
        </Text>
      </TouchableOpacity>

      {/* Botón de Google */}
      <TouchableOpacity
        style={[styles.iniciarSesion, { backgroundColor: "#DB4437", marginTop: 10 }]}
        onPress={onGoogleSignIn}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: 'bold' }}>
          Iniciar sesión con Google
        </Text>
      </TouchableOpacity>

      {/* Botón para ir a Registro */}
      <Link href="/auth/register" asChild>
        <TouchableOpacity style={{ marginTop: 20 }}>
          <Text style={{ color: "#666", textAlign: "center" }}>
            ¿No tienes cuenta? <Text style={{ color: "#1a73e8", fontWeight: 'bold' }}>Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </Link>

      <View>
        <Image
          source={require("../assets/mindboxlogo.png")}
          style={styles.logo}
        />
      </View>
    </View>
  );
}