import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Linking,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { styles } from '../../styles/auth.styles';

const STORAGE_KEY = '@marcadores';

interface Marcador {
  id: string;
  titulo: string;
  url: string;
  categoria: string;
  creadoEn: string;
}

const CATEGORIAS = ['General', 'Escolar', 'Tarea', 'Recurso', 'Otro'];

export default function Marcadores() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 600;
  const cardWidth = isLargeScreen ? 500 : '100%';

  const [marcadores, setMarcadores] = useState<Marcador[]>([]);
  const [titulo, setTitulo] = useState('');
  const [url, setUrl] = useState('');
  const [categoria, setCategoria] = useState('General');
  const [filtro, setFiltro] = useState('Todos');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) setMarcadores(JSON.parse(data));
    });
  }, []);

  const guardar = async (lista: Marcador[]) => {
    setMarcadores(lista);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  };

  const agregar = async () => {
    if (!titulo.trim() || !url.trim()) {
      Alert.alert('Campos requeridos', 'Ingresa título y URL.');
      return;
    }
    const urlFinal = url.startsWith('http') ? url : `https://${url}`;
    const nuevo: Marcador = {
      id: Date.now().toString(),
      titulo: titulo.trim(),
      url: urlFinal,
      categoria,
      creadoEn: new Date().toLocaleDateString('es-MX'),
    };
    await guardar([nuevo, ...marcadores]);
    setTitulo('');
    setUrl('');
    setCategoria('General');
  };

  const eliminar = (id: string) => {
    Alert.alert('Eliminar', '¿Borrar este marcador?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => guardar(marcadores.filter((m) => m.id !== id)) },
    ]);
  };

  const categoriaColores: Record<string, string> = {
    General: '#4A3AAA',
    Escolar: '#2E7D32',
    Tarea: '#B71C1C',
    Recurso: '#1565C0',
    Otro: '#6A1B9A',
  };

  const filtrados = filtro === 'Todos' ? marcadores : marcadores.filter((m) => m.categoria === filtro);

  return (
    <View style={[styles.container, { paddingHorizontal: isLargeScreen ? 0 : 22, paddingTop: 20 }]}>

      <Text style={[styles.title, { textAlign: 'left', width: cardWidth, fontSize: 20, marginBottom: 4 }]}>
        🔖 Marcadores
      </Text>
      <Text style={[styles.subtitle, { textAlign: 'left', width: cardWidth, marginBottom: 14 }]}>
        {marcadores.length} enlace{marcadores.length !== 1 ? 's' : ''} guardado{marcadores.length !== 1 ? 's' : ''}
      </Text>

      {/* Formulario */}
      <View style={[styles.card, { width: cardWidth }]}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Ej. Apuntes de matemáticas"
          placeholderTextColor="#5A4E8A"
        />
        <Text style={styles.label}>URL</Text>
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          placeholder="https://..."
          placeholderTextColor="#5A4E8A"
          autoCapitalize="none"
          keyboardType="url"
        />
        <Text style={styles.label}>Categoría</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 14, paddingBottom: 12 }}>
          {CATEGORIAS.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategoria(cat)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 5,
                borderRadius: 20,
                backgroundColor: categoria === cat ? '#6C55D4' : '#1E1545',
                borderWidth: 0.5,
                borderColor: categoria === cat ? '#6C55D4' : '#3D3070',
              }}
            >
              <Text style={{ color: categoria === cat ? '#fff' : '#7B6EB0', fontSize: 12 }}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={[styles.iniciarSesion, { marginHorizontal: 14, marginBottom: 4 }]} onPress={agregar}>
          <Text style={styles.buttonText}>+ Guardar marcador</Text>
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, width: cardWidth, marginBottom: 12 }}>
        {['Todos', ...CATEGORIAS].map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setFiltro(cat)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 20,
              backgroundColor: filtro === cat ? '#6C55D4' : '#2A1F5C',
              borderWidth: 0.5,
              borderColor: filtro === cat ? '#6C55D4' : '#3D3070',
            }}
          >
            <Text style={{ color: filtro === cat ? '#fff' : '#7B6EB0', fontSize: 12 }}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista */}
      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        style={{ width: '100%', maxWidth: 500 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ fontSize: 36, marginBottom: 10 }}>🔖</Text>
            <Text style={styles.description}>No hay marcadores aún.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { width: cardWidth, alignItems: 'stretch' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <View style={{
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 10,
                    backgroundColor: categoriaColores[item.categoria] || '#4A3AAA',
                  }}>
                    <Text style={{ color: '#fff', fontSize: 10 }}>{item.categoria}</Text>
                  </View>
                  <Text style={{ color: '#7B6EB0', fontSize: 10 }}>{item.creadoEn}</Text>
                </View>
                <Text style={[styles.value, { fontSize: 14, marginBottom: 4 }]}>{item.titulo}</Text>
                <Text style={{ color: '#7B6EB0', fontSize: 11 }} numberOfLines={1}>{item.url}</Text>
              </View>
              <TouchableOpacity onPress={() => eliminar(item.id)} style={{ padding: 6 }}>
                <Text style={{ fontSize: 16 }}>🗑️</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => Linking.openURL(item.url)}
              style={{
                marginTop: 12,
                backgroundColor: '#1E1545',
                borderRadius: 8,
                paddingVertical: 8,
                alignItems: 'center',
                borderWidth: 0.5,
                borderColor: '#3D3070',
              }}
            >
              <Text style={{ color: '#6C55D4', fontSize: 13, fontWeight: '500' }}>🌐 Abrir enlace</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}