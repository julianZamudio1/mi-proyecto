import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

// Bloque de persistencia comentado (se iniciará sesión cada vez)
/*
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err: any) {
      console.log("Token cache error:", err);
    }
  },
};
*/

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "auth";

    if (isSignedIn && inAuthGroup) {
      // Si ya inició sesión, enviarlo a la pantalla principal de tabs
      router.replace("/(tabs)/main"); 
    } else if (!isSignedIn && !inAuthGroup) {
      // Si no hay sesión iniciada, obligar a ir al login
      router.replace("/auth/login");
    }
  }, [isSignedIn, isLoaded, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Definición de rutas para el Stack */}
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  // Asegúrate de tener esta variable en tu archivo .env
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <InitialLayout />
    </ClerkProvider>
  );
}