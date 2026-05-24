import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 80) / 3;

export const styles = StyleSheet.create({

  // ── Contenedor principal ──────────────────────────────────────
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 32,
    paddingBottom: 40,
    backgroundColor: '#1E1545',
  },

  // ── Animación Lottie ──────────────────────────────────────────
  animationContainer: {
    width: '100%',
    backgroundColor: '#2A1F5C',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#3D3070',
    alignItems: 'center',
    justifyContent: 'center',
    height: 130,
    marginBottom: 20,
  },

  // ── Marca / título ────────────────────────────────────────────
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#EDE9FB',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#7B6EB0',
    textAlign: 'center',
    marginTop: 3,
    marginBottom: 22,
  },

  // ── Selector Estudiantes / Personal ──────────────────────────
  tipoUsuario: {
    flexDirection: 'row',
    backgroundColor: '#2A1F5C',
    borderRadius: 12,
    padding: 3,
    width: '100%',
    marginBottom: 18,
  },
  botonMenu: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonActivo: {
    backgroundColor: '#4A3AAA',
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7B6EB0',
  },
  textoActivo: {
    color: '#EDE9FB',
  },

  // ── Tarjeta de formulario ─────────────────────────────────────
  card: {
    width: '100%',
    backgroundColor: '#2A1F5C',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#3D3070',
    overflow: 'hidden',
    marginBottom: 14,
    padding: 16,
    alignItems: 'center',
  },

  // ── Campos de texto ───────────────────────────────────────────
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: '#7B6EB0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  input: {
    width: '100%',
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 2,
    fontSize: 14,
    color: '#EDE9FB',
    borderBottomWidth: 0.5,
    borderBottomColor: '#3D3070',
  },

  // ── Botón principal ───────────────────────────────────────────
  iniciarSesion: {
    width: '100%',
    backgroundColor: '#6C55D4',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 10,
  },

  // ── Perfil ────────────────────────────────────────────────────
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#4A3AAA',
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#1E1545',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#3D3070',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    color: '#EDE9FB',
    marginTop: 2,
  },
  description: {
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
    color: '#9B8FCE',
    lineHeight: 20,
  },

  // ── Logo inferior ─────────────────────────────────────────────
  logo: {
    marginTop: 28,
    width: 100,
    height: 40,
    resizeMode: 'contain',
    opacity: 0.7,
  },

  // ── Cámara ────────────────────────────────────────────────────
  cameraPreviewContainer: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    overflow: 'hidden',
    marginVertical: 15,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#1E1545',
    padding: 12,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  actionButtonRecording: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  // ── Galería interna ───────────────────────────────────────────
  galleryContainer: {
    width: '100%',
    marginBottom: 20,
  },
  galleryTitle: {
    color: '#EDE9FB',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  galleryItem: {
    margin: 2,
    position: 'relative',
  },
  galleryImage: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  videoBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    padding: 2,
  },
  videoBadgeText: {
    fontSize: 10,
  },

  // ── Permisos ──────────────────────────────────────────────────
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1E1545',
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    color: '#EDE9FB',
  },
  // ── Modal visor ───────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#2A1F5C',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#3D3070',
    overflow: 'hidden',
    padding: 8,
  },
  modalClose: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  modalCloseText: {
    color: '#EDE9FB',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalImage: {
    width: '100%',
    height: 350,
    borderRadius: 12,
  },
  modalVideoPlaceholder: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  modalVideoIcon: {
    fontSize: 48,
  },
  modalVideoText: {
    color: '#EDE9FB',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
  },
  modalVideoUri: {
    color: '#7B6EB0',
    fontSize: 10,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
