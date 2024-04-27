import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-elements";
import { Image } from "expo-image";

const UploadingImages: React.FC = () => {
  const params = useLocalSearchParams();
  const {
    communityName,
    description,
    postFreq,
    selectedTags: rawSelectedTags,
  } = params;
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const parseTags = (tagsString: string) => {
    return tagsString.split(",").map((tag) => {
      const [name, color] = tag.trim().split(" #");
      return { name, color: `#${color}` };
    });
  };
  const selectedTags = Array.isArray(rawSelectedTags)
    ? rawSelectedTags[0]
    : rawSelectedTags;
  useEffect(() => {
    fetchBackgroundImages();
  }, []);

  const fetchBackgroundImages = async () => {
    try {
      const response = await axios.get(`${url}/community/backgroundImages`);
      const imageUrls = response.data.map((imageId) => ({
        id: imageId,
        uri: `${url}/community/image/${imageId}`,
      }));
      setBackgroundImages(imageUrls);
    } catch (error) {
      console.error("Failed to fetch background images:", error);
    }
  };

  const { url } = useSelector((state: any) => state.user);
  const uploadImage = async () => {
    // Ensure there is a selected image to upload
    if (!selectedImage) {
      Alert.alert("Upload Error", "No image selected for upload.");
      return;
    }

    const parsedTags = parseTags(selectedTags);
    const tagsPayload = parsedTags.map((tag) => ({
      name: tag.name,
      color: tag.color,
    }));
    const payload = {
      name: communityName,
          description,
          tags: tagsPayload,
    };
    console.log("Payload:", payload);
    try {
      const response = await axios.post(
        `${url}/community?goalDays=${postFreq}`,
        {
          name: communityName,
          description,  
          tags: tagsPayload,
          
        },
        {
          headers: {
            "Content-Type": "application/json", // Ensure headers are set for JSON
          },
        }
      );

      if (response.status === 201) {
        // If the community is successfully created, then upload the image
        const communityId = response.data.id; // Ensure you get the correct ID from response
        let formData = new FormData();
        // Append the image data to formData; ensure the structure matches what the server expects
        formData.append("data", {
          uri: selectedImage.uri,
          name: "image.jpg",
          type: "image/jpg",
        } as any);

        const uploadImg = await axios.put(
          `${url}/community/${communityId}/image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (uploadImg.status === 200) {
          router.push("/(tabs)/Communities");
        } else {
          throw new Error("Image upload failed");
        }
      } else {
        throw new Error("Community creation failed");
      }
    } catch (error) {
      console.error("Error creating community:", error);
      Alert.alert(
        "Creation Error",
        `An error occurred while creating the community: ${error.message}`
      );
    }
  };

  const pickImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
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
      return;
    }

    setSelectedImage({ uri: pickerResult.assets[0].uri });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Choose a Background Image</Text>
        <View style={styles.imageContainer}>
          {backgroundImages.map((img) => (
            <TouchableOpacity
              key={img.id}
              onPress={() => setSelectedImage(img)}
              style={styles.imageWrapper}
            >
              <Image source={{ uri: img.uri }} style={styles.image} />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.title}>---------- Or ----------</Text>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Upload Your Own Image</Text>
        </TouchableOpacity>
        {selectedImage && (
          <>
            <Image
              source={{ uri: selectedImage.uri }}
              style={styles.previewImage}
            />
            <TouchableOpacity style={styles.button} onPress={uploadImage}>
              <Text style={styles.buttonText}>Confirm Upload</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollViewContent: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    color: "#FFF",
    fontWeight: "bold",
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  imageWrapper: {
    padding: 5,
    borderRadius: 10,
    margin: 5,
    borderColor: "#FFF",
    borderWidth: 1,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  previewImage: {
    width: 300,
    height: 300,
    contentFit: "contain",
    marginVertical: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#5C5CFF",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default UploadingImages;
