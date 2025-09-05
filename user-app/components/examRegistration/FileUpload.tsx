import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export default function FileUpload({ onFileSelected }) {
  const [fileName, setFileName] = useState('');
  
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true
      });
      
      if (result.type === 'success') {
        // Check file size
        const fileInfo = await FileSystem.getInfoAsync(result.uri);
        const fileSize = fileInfo.size / (1024 * 1024); // in MB
        
        if (fileSize > 2) {
          Alert.alert('Error', 'File size exceeds 2MB limit');
          return;
        }
        
        setFileName(result.name);
        onFileSelected({
          uri: result.uri,
          name: result.name,
          type: result.mimeType
        });
      }
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('Error', 'Failed to pick document');
    }
  };
  
  return (
    <View>
      <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
        <Text style={styles.buttonText}>
          {fileName ? `Selected: ${fileName}` : 'Choose File'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  uploadButton: {
    borderWidth: 1,
    borderColor: '#1a73e8',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10
  },
  buttonText: {
    color: '#1a73e8'
  }
});