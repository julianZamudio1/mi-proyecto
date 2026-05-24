import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import React, { useRef, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { styles } from '../../styles/auth.styles';

type MediaItem = { uri: string; type: 'photo' | 'video' };

export default function Profile() {
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const cameraRef = useRef<CameraView>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraMode, setCameraMode] = useState<'picture' | 'video'>('picture');
  const [gallery, setGallery] = useState<MediaItem[]>([]);
  const [selected, setSelected] = useState<MediaItem | null>(null);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();

  if (!cameraPermission || !microphonePermission) return <View />;

  const handleRequestPermissions = async () => {
    await requestCameraPermission();
    await requestMicrophonePermission();
  };

  if (!cameraPermission.granted || !microphonePermission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Se requieren permisos de cámara y audio.</Text>
        <Button onPress={handleRequestPermissions} title="Otorgar Permisos" />
      </View>
    );
  }

  const takePicture = async () => {
    if (isRecording) return;
    // Asegura modo foto antes de capturar
    setCameraMode('picture');
    setTimeout(async () => {
      if (cameraRef.current) {
        try {
          const photo = await cameraRef.current.takePictureAsync();
          if (photo) {
            setGallery(prev => [{ uri: photo.uri, type: 'photo' }, ...prev]);
          }
        } catch {
          Alert.alert("Error", "No se pudo tomar la foto");
        }
      }
    }, 300); // pequeño delay para que cambie el modo
  };

  const recordVideo = async () => {
    if (!cameraRef.current) return;
    if (isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    } else {
      setCameraMode('video');
      setTimeout(async () => {
        setIsRecording(true);
        try {
          const video = await cameraRef.current!.recordAsync();
          if (video) {
            setGallery(prev => [{ uri: video.uri, type: 'video' }, ...prev]);
          }
        } catch {
          setIsRecording(false);
        } finally {
          setIsRecording(false);
          setCameraMode('picture');
        }
      }, 300);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>

        <Image source={require("../assets/imagen.jpg")} style={styles.image} />
        <Text style={styles.title}>Julian Zamudio</Text>
        <Text style={styles.subtitle}>Ingeniería en Sistemas Computacionales</Text>

        {/* Cámara */}
        <View style={styles.cameraPreviewContainer}>
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
            mode={cameraMode}
          />
        </View>

        {/* Botones */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={takePicture}>
            <Text style={styles.buttonText}>📸 Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, isRecording && styles.actionButtonRecording]}
            onPress={recordVideo}
          >
            <Text style={styles.buttonText}>{isRecording ? "⏹ Parar" : "🎥 Video"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}
          >
            <Text style={styles.buttonText}>🔄</Text>
          </TouchableOpacity>
        </View>

        {/* Galería */}
        {gallery.length > 0 && (
          <View style={styles.galleryContainer}>
            <Text style={styles.galleryTitle}>📁 Galería ({gallery.length})</Text>
            <FlatList
              data={gallery}
              keyExtractor={(_, i) => i.toString()}
              numColumns={3}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.galleryItem} onPress={() => setSelected(item)}>
                  <Image source={{ uri: item.uri }} style={styles.galleryImage} />
                  {item.type === 'video' && (
                    <View style={styles.videoBadge}>
                      <Text style={styles.videoBadgeText}>▶️</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.label}>Trabajo</Text>
          <Text style={styles.value}>McDonald's</Text>
        </View>

      </View>

      {/* Modal visor */}
      <Modal visible={!!selected} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setSelected(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TouchableOpacity style={styles.modalClose} onPress={() => setSelected(null)}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>

                {selected?.type === 'photo' ? (
                  <Image
                    source={{ uri: selected.uri }}
                    style={styles.modalImage}
                    resizeMode="contain"
                  />
                ) : selected?.type === 'video' ? (
                  <View style={styles.modalVideoPlaceholder}>
                    <Text style={styles.modalVideoIcon}>🎥</Text>
                    <Text style={styles.modalVideoText}>
                      Vista previa de video{'\n'}no disponible en Expo Go
                    </Text>
                    <Text style={styles.modalVideoUri} numberOfLines={2}>
                      {selected.uri}
                    </Text>
                  </View>
                ) : null}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </ScrollView>
  );
}