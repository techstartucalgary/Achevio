import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Image } from 'expo-image';

import RNFS from "react-native-fs";
const EditPost = () => {
  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState("");
  const params = useLocalSearchParams();
  const photoUri = params.photoUri;
  const isSubmitting = React.useMemo(() => false, []);

  const handleSubmit = () => {
    if (!title || !caption) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    router.push({
      pathname: "/PickCommunity",
      params: {
        photoUri: photoUri,
        caption: caption,
        title: title,
      },
    });
  };
  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          {photoUri && (
            <Image
              source={{ uri: photoUri.toString() }}
              style={styles.imagePreview}
            />
          )}

          <TextInput
            style={styles.input}
            onChangeText={setTitle}
            value={title}
            placeholder="Title"
            placeholderTextColor="#999"
          />

          <TextInput
            style={[styles.input, styles.captionInput]}
            onChangeText={setCaption}
            value={caption}
            placeholder="Add a caption..."
            placeholderTextColor="#999"
            multiline
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },
  input: {
    width: "90%",
    margin: 12,
    borderWidth: 1,
    borderColor: "#333",
    padding: 10,
    borderRadius: 8,
    color: "#ffffff",
    backgroundColor: "#222",
  },
  captionInput: {
    height: 150,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#5C5CFF",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
    width: "90%",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
  },
  imagePreview: {
    width: "90%",
    height: 400,
    borderRadius: 8,
    marginBottom: 20,
  },
});

export default EditPost;
