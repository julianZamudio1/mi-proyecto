# Mindbox · App móvil de gestión académica

Aplicación móvil multiplataforma (Android, iOS y web) para estudiantes, desarrollada con **React Native, Expo y TypeScript**. Integra autenticación con **Clerk** (correo/contraseña y **Google OAuth 2.0**), navegación por archivos con **Expo Router**, gestión de tareas con fecha límite, muro de fotos con la cámara del dispositivo, marcadores y notificaciones internas.

![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-SDK_54-000020?logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&logoColor=white)

<!-- Agrega aquí capturas de pantalla, por ejemplo:
<p align="center">
  <img src="docs/login.png" width="200"/>
  <img src="docs/tareas.png" width="200"/>
  <img src="docs/muro.png" width="200"/>
</p>
-->

## Funcionalidades

- **Autenticación:** registro e inicio de sesión con correo y contraseña, o con Google (OAuth 2.0) mediante Clerk; selector de tipo de usuario (Estudiantes / Personal).
- **Rutas protegidas:** el layout raíz redirige a login si no hay sesión y a la app principal si ya la hay.
- **Tareas:** CRUD de tareas con nombre, descripción y fecha de finalización (DateTimePicker), edición en línea e indicador por colores según la proximidad de la fecha (vencida, hoy, mañana, a tiempo).
- **Muro de fotos:** captura con la cámara (expo-image-picker) y publicación persistida localmente con AsyncStorage.
- **Perfil:** cámara integrada (expo-camera) con modo foto y video, cambio entre cámara frontal y trasera, y galería de lo capturado.
- **Marcadores:** guardar enlaces con título, URL y categoría, con filtro por categoría.
- **Notificaciones:** historial de eventos de la app (tareas y fotos nuevas) con opción de marcar como leídas o limpiar.
- **UI:** navegación por pestañas con íconos, animaciones Lottie y diseño responsivo.

## Stack

| Área | Tecnología |
|---|---|
| Framework | React Native 0.81, Expo SDK 54 (nueva arquitectura) |
| Lenguaje | TypeScript |
| Navegación | Expo Router (rutas basadas en archivos), Bottom Tabs |
| Autenticación | Clerk (`@clerk/clerk-expo`), Google OAuth, expo-auth-session |
| Persistencia | AsyncStorage |
| Hardware | expo-camera, expo-image-picker, expo-media-library |
| UI / animación | Lottie, @expo/vector-icons, Reanimated |
| Calidad | ESLint (eslint-config-expo) |
| Builds | EAS Build |

## Estructura

```
app/
├── _layout.tsx               # ClerkProvider + redirección según sesión
├── auth/
│   ├── login.tsx             # Login con correo o Google
│   └── register.tsx          # Registro de usuario
├── (tabs)/
│   ├── _layout.tsx           # Navegación por pestañas
│   ├── index.tsx             # Inicio y accesos rápidos
│   ├── homework.tsx          # CRUD de tareas con fechas
│   ├── feed.tsx              # Muro de fotos
│   ├── profile.tsx           # Perfil con cámara foto/video
│   ├── bookmark.tsx          # Marcadores por categoría
│   ├── notifications.tsx     # Notificaciones internas
│   └── main.tsx              # Pantalla principal y cierre de sesión
├── oauth-native-callback.tsx # Retorno del flujo OAuth
└── assets/
styles/
└── auth.styles.js            # Estilos compartidos
```

## Instalación y ejecución

**Requisitos:** Node.js 18+, una cuenta de [Clerk](https://clerk.com) con Google habilitado como proveedor social, y la app Expo Go o un emulador Android/iOS.

```bash
git clone https://github.com/julianZamudio1/mi-proyecto.git
cd mi-proyecto
npm install
```

Crea un archivo `.env` en la raíz:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxx
```

Inicia el proyecto:

```bash
npx expo start          # Menú de Expo (QR para Expo Go)
npm run android         # Build nativo en Android
npm run web             # Versión web
```

> El login con Google requiere un *development build* (`expo-dev-client`) porque usa un esquema de URL propio (`miproyecto://`).

## Autor

**Eduardo Julián Zamudio Govea** · Ingeniería en Sistemas Computacionales, ITLP
[github.com/julianZamudio1](https://github.com/julianZamudio1)
