import { useUser } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';

import { styles } from '../../styles/auth.styles';

const STORAGE_KEY = '@local_feed_posts';

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userEmail: string;
  createdAt: string;
  imageUri: string;
}

export default function FeedScreen() {
  const { user } = useUser();
  const { width } = useWindowDimensions();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadLocalPosts = async () => {
      try {
        const savedPosts = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedPosts) {
          setPosts(JSON.parse(savedPosts));
        }
      } catch (error) {
        console.error("Error cargando los posts locales:", error);
      }
    };
    loadLocalPosts();
  }, []);

  const handleCapturePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permiso requerido", "Se necesitan permisos para usar la cámara.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;

      try {
        const newPost: Post = {
          id: Date.now().toString(),
          userId: user?.id || 'anon_id',
          userName: user?.fullName || 'Usuario',
          userAvatar: user?.imageUrl || 'https://via.placeholder.com/150',
          userEmail: user?.primaryEmailAddress?.emailAddress || '',
          createdAt: new Date().toLocaleString('es-MX', {
            dateStyle: 'medium',
            timeStyle: 'short'
          }),
          imageUri,
        };

        const updatedPosts = [newPost, ...posts];
        setPosts(updatedPosts);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));

      } catch (error) {
        Alert.alert("Error", "No se pudo guardar la imagen.");
        console.error(error);
      }
    }
  };

  const isLargeScreen = width > 600;
  const cardWidth = isLargeScreen ? 500 : '100%';

  return (
    <View style={[styles.container, { paddingHorizontal: isLargeScreen ? 0 : 22, paddingVertical: 16 }]}>

      {/* ── Header compacto arriba ── */}
      <View style={{
        width: cardWidth,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
      }}>
        <View>
          <Text style={[styles.title, { textAlign: 'left', fontSize: 18 }]}>Muro de Fotos</Text>
          <Text style={[styles.subtitle, { textAlign: 'left', marginBottom: 0, marginTop: 2 }]}>
            {posts.length} publicación{posts.length !== 1 ? 'es' : ''}
          </Text>
        </View>

        {/* ✅ Botón pequeño tipo FAB */}
        <TouchableOpacity
          onPress={handleCapturePhoto}
          style={{
            backgroundColor: '#6C55D4',
            borderRadius: 10,
            paddingVertical: 8,
            paddingHorizontal: 14,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Text style={{ fontSize: 16 }}>📸</Text>
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 13 }}>Foto</Text>
        </TouchableOpacity>
      </View>

      {/* ── Feed ── */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        style={{ width: '100%', maxWidth: 500 }}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ marginTop: 60, alignItems: 'center' }}>
            <Text style={{ fontSize: 36, marginBottom: 12 }}>📷</Text>
            <Text style={styles.description}>No hay fotos publicadas todavía.</Text>
            <Text style={[styles.subtitle, { marginTop: 6 }]}>Toca el botón Foto para comenzar</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { width: cardWidth, padding: 0, alignItems: 'stretch', marginBottom: 16 }]}>

            {/* ── Info del perfil arriba del post ── */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 12,
              borderBottomWidth: 0.5,
              borderBottomColor: '#3D3070',
            }}>
              <Image
                source={{ uri: item.userAvatar }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  borderWidth: 2,
                  borderColor: '#4A3AAA',
                }}
              />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={[styles.value, { fontSize: 14 }]}>{item.userName}</Text>
                {item.userEmail ? (
                  <Text style={{ fontSize: 11, color: '#7B6EB0', marginTop: 1 }}>
                    {item.userEmail}
                  </Text>
                ) : null}
                <Text style={{ fontSize: 11, color: '#7B6EB0', marginTop: 1 }}>
                  🕐 {item.createdAt}
                </Text>
              </View>
            </View>

            {/* ── Foto del post ── */}
            <View style={{ height: 300, backgroundColor: '#000' }}>
              <Image
                source={{ uri: item.imageUri }}
                style={{ flex: 1 }}
                resizeMode="cover"
                onError={(e) => console.log("Error imagen:", e.nativeEvent.error)}
              />
            </View>

          </View>
        )}
      />
    </View>
  );
}