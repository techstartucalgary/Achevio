import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, Animated } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

interface Tag {
  name: string;
  color: string;
  category?: string;
}

const categories = {
  Sports: ["Running", "Swimming", "Cycling", "Soccer", "Basketball", "Golf", "Surfing", "Skateboarding"],
  Music: ["Guitar", "Piano", "Singing", "Dancing", "Violin"],
  Art: ["Drawing", "Painting", "Sculpting"],
  Lifestyle: ["Cooking", "Hiking", "Reading", "Baking", "Sewing", "Studying", "Gardening", "Meditation", "Yoga", "Photography"]
};

const YourProfile = () => {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const { url } = useSelector((state: any) => state.user);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const pickImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (pickerResult.canceled) {
      console.log("Image picker canceled");
      return;
    }

    setAvatarUri(pickerResult.assets[0].uri as string);
    uploadImage(pickerResult.assets[0].uri as string);
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
      const response = await axios.patch(url_extension, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Image uploaded successfully:", response);
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Upload Failed", "Failed to upload profile image.");
    }
  };

  useEffect(() => {
    const options = {
      method: "GET",
      url: `${url}/tag`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "",
      },
    };
    async function fetchData() {
      try {
        const { data } = await axios.request(options);
        console.log("Fetched tags:", data);
        setTags(data);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to fetch tags");
      }
    }
    fetchData();
  }, []);

  const handleSelectTag = (tag: Tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t.name !== tag.name) : [...prev, tag]);
  };

  const navigateToNext = () => {
    router.push("/(tabs)/Camera");
  };
  const renderTagsByCategory = (category: string) => {
    return tags.filter(tag => tag.category === category).map(tag => (
        console.log(tag),
      <TouchableOpacity key={tag.name} style={[styles.tagItem, { backgroundColor: selectedTags.includes(tag) ? '#4CAF50' : tag.color }]}
        onPress={() => handleSelectTag(tag)}>
        <Text style={styles.tagText}>{tag.name}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Text style={styles.buttonText}>Set Profile Picture</Text>
        </TouchableOpacity>
        {avatarUri && <Image source={{ uri: avatarUri }} style={styles.avatar} />}
        <Text style={styles.title}>Select Interests:</Text>
        {Object.keys(categories).map(category => (
          <View key={category}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {renderTagsByCategory(category)}
          </View>
        ))}
        <TouchableOpacity onPress={navigateToNext} style={styles.button}>
          <Text style={styles.buttonText}>Go Next</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#DDD',
    marginTop: 20,
  },
  tagItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    color: 'white',
    fontSize: 18,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default YourProfile;
