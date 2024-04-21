import axios from "axios";
import React, { useState } from "react";
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
} from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-elements";

const UploadingImages: React.FC = () => {
  const params = useLocalSearchParams();
  const communityName = params.communityName; 
  const description = params.description;
  const selectedTags: string[] = Array.isArray(params.selectedTags) ? params.selectedTags : [params.selectedTags];
  const postDays: string[] = Array.isArray(params.postDays) ? params.postDays : [params.postDays];
  
  const { url } = useSelector((state: any) => state.user);
  const handleCreateCommunity = async (formData:any) => {
    // Transform postDays and selectedTags into arrays of objects
    const postDaysPayload = postDays.map((day) => ({ day }));
    const tagsPayload = selectedTags.map((name) => ({ name, color:"" }));

    try {
      const res = await axios.post(`${url}/community`, {
        name: communityName,
        description,
        postdays: postDaysPayload, // Send as an array of objects
        tags: tagsPayload, // Send as an array of objects
      });
      const uploadImg = await axios.put(`${url}/community/${res.data.id}/image`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      if (res.status === 201 && uploadImg.status === 200) {
        router.push("/(tabs)/Communities");
      }
    } catch (error) {
      console.error("Error creating community:", error);
    }
  };

  const uploadCommunityImage = async () => {
    let permissionResult = ImagePicker.requestMediaLibraryPermissionsAsync();
    permissionResult.then(async (permission) => {
      if (permission.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16,9],
        quality: 1,
      });
      if (pickerResult.canceled) {
        return;
      }
      let localUri = pickerResult.assets[0].uri;
      let formData = new FormData();
      formData.append("data", {
        uri: localUri,
        name: "image.jpg",
        type: "image/jpg",
      } as any);
      
      handleCreateCommunity(formData);
    });
  };
  return (
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
        >
            <View style={styles.formContainer}>
            <TouchableOpacity onPress={uploadCommunityImage} style={[styles.button, {position:"absolute",bottom:0}]}>
                <Text style={styles.buttonText}>Upload Community Image</Text>
            </TouchableOpacity>
            </View>

        </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background color
  },
  keyboardView: {
    flex: 1,
  },
  formContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FFF", // Light text color
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#333", // Darker border color
    padding: 10,
    borderRadius: 8,
    margin: 5,
    color: "#FFF", // Light text color
    backgroundColor: "#222", // Dark input background
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 5,
    marginBottom: 5,
    fontWeight: "bold",
    color: "#FFF", // Light text color
  },
  button: {
    backgroundColor: "#5C5CFF",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    margin: 20,
  },
  buttonText: {
    color: "#FFF", // Light text color
    fontWeight: "bold",
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  tag: {
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 20,
    padding: 8,
    margin: 4,
    backgroundColor: "#222", // Dark tag background
  },
  tagSelected: {
    backgroundColor: "#007bff",
  },
  tagText: {
    color: "#FFF", // Light text color
    fontSize: 14,
  },
  tagTextSelected: {
    color: "#FFF",
  },
  scrollView: {
    width: "100%",
  },
  subtitle: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#FFF", // Light text color
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  dayButton: {
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 20,
    padding: 8,
    margin: 4,
    backgroundColor: "#222", // Dark day button background
  },
  daySelected: {
    backgroundColor: "#007bff",
  },
  dayText: {
    color: "#FFF", // Light text color
    fontSize: 14,
  },
  dayTextSelected: {
    color: "#FFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333", // Darker border color
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    width: "100%",
    backgroundColor: "#222", // Dark input container background
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
    color: "#FFF", // Light text color
    backgroundColor: "#222", // Dark text area background
  },
});
export default UploadingImages;