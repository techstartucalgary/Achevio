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
    const tagsPayload = selectedTags.map((name) => ({ name }));

    try {
      const res = await axios.post(`${url}/user/community`, {
        name: communityName,
        description,
        postdays: postDaysPayload, // Send as an array of objects
        tags: tagsPayload, // Send as an array of objects
      });
      console.log("Response:", res);
      console.log("Community created successfully:", res.data);
      console.log("formData:", formData); 
      const uploadImg = await axios.put(`${url}/community/${res.data.id}/image`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      console.log('uploadImg:', uploadImg);
      if (res.status === 201 && uploadImg.status === 200) {
        console.log("Community created successfully:", res.data);
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
        console.log("Image picker canceled");
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
    backgroundColor: "#fff",
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
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    margin: 5,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 5,
    marginBottom: 5,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    margin: 20,
  },
  buttonText: {
    color: "#fff",
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
  },
  tagSelected: {
    backgroundColor: "#007bff",
  },
  tagText: {
    color: "#000",
    fontSize: 14,
  },
  tagTextSelected: {
    color: "#fff",
  },
  scrollView: {
    width: "100%",
  },
  subtitle: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
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
  },
  daySelected: {
    backgroundColor: "#007bff",
  },
  dayText: {
    color: "#000",
    fontSize: 14,
  },
  dayTextSelected: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    width: "100%",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
});
export default UploadingImages;
