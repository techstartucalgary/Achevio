import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, Animated } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const YourProfile = () => {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const { url } = useSelector((state: any) => state.user);
  const scaleAnim = useRef(new Animated.Value(1)).current;  // Initial scale value

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setAvatarUri(pickerResult.assets[0].uri as string);
      animateImage();
      uploadImage(pickerResult.assets[0].uri as string);
    }
  };

  const uploadImage = async (uri: string) => {
    const url_extension = `${url}/user/profile_image`;
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "image.jpg",
      type: "image/jpg",
    } as any);

    try {
      await axios.patch(url_extension, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Upload Failed", "Failed to upload profile image.");
    }
  };

  const animateImage = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true
      })
    ]).start();
  };

  return (
    <LinearGradient colors={['#3a1c71', '#d76d77', '#ffaf7b']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Set Your Profile Picture</Text>
        <TouchableOpacity onPress={pickImage} style={styles.avatarPlaceholder}>
          {avatarUri ? (
            <Animated.Image
              source={{ uri: avatarUri }}
              style={[styles.avatar, { transform: [{ scale: scaleAnim }] }]}
            />
          ) : (
            <Text style={styles.avatarText}>Tap to select image</Text>
          )}
        </TouchableOpacity>
        {avatarUri ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/(Tutorial)/pickIntrest')} // Navigate to next screen (pickIntrest
          >
            <Text style={styles.buttonText}>Go next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
        )
          
        }

      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ffffff30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default YourProfile;
