import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.7,
};

export function usePhotoPicker() {
  const pickFrom = async (source: 'camera' | 'library'): Promise<string | null> => {
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera/fotos para continuar.');
      return null;
    }
    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync(PICKER_OPTIONS)
        : await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
    if (result.canceled || !result.assets?.length) return null;
    return result.assets[0].uri;
  };

  const choosePhoto = (onPicked: (uri: string) => void) => {
    const handle = async (source: 'camera' | 'library') => {
      const uri = await pickFrom(source);
      if (uri) onPicked(uri);
    };
    Alert.alert('Foto do pet', 'Como você quer adicionar a foto?', [
      { text: 'Tirar foto', onPress: () => handle('camera') },
      { text: 'Escolher da galeria', onPress: () => handle('library') },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  return { choosePhoto };
}
