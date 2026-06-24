import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { scanReceipt } from '@/src/api/client';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCapture = async () => {
    if (!cameraRef.current) {
      return;
    }

    setIsCapturing(true);
    setMessage(null);

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
      if (!photo?.uri) {
        throw new Error('Unable to capture image.');
      }

      const response = await scanReceipt(photo.uri);
      setMessage(`Receipt queued (${response.receiptId}).`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to scan receipt.';
      setMessage(errorMessage);
    } finally {
      setIsCapturing(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
        <Text style={styles.helperText}>Checking camera permissions…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.helperText}>Camera access is required to scan grocery receipts.</Text>
        <Pressable style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.buttonLabel}>Enable Camera</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <Pressable style={styles.primaryButton} onPress={handleCapture} disabled={isCapturing}>
        <Text style={styles.buttonLabel}>{isCapturing ? 'Scanning…' : 'Snap & Scan Receipt'}</Text>
      </Pressable>
      {message ? <Text style={styles.helperText}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    padding: 16,
    backgroundColor: '#fff',
  },
  camera: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
    backgroundColor: '#fff',
  },
  primaryButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  helperText: {
    color: '#1F2937',
    textAlign: 'center',
  },
});
