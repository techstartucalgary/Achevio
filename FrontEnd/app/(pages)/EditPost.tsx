import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ActivityIndicator, Keyboard,TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import RNFS from 'react-native-fs';
const EditPost = () => {
const [caption, setCaption] = useState('');
  const [title, setTitle] = useState('');
  const [communityid, setCommunityid] = useState('065a9e87-290d-7747-8000-91b7092726c3');
  const params = useLocalSearchParams();
  const photoUri = params.photoUri;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = 'http://10.9.124.36:8000'

  const handleSubmit = async () => {
    console.log('Caption:', caption);

  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}  accessible={false}>
    <View style={styles.container}>
      <Text style={styles.headerText}>Edit Your Post</Text>

      {photoUri && (
        <Image source={{ uri: photoUri.toString() }} style={styles.imagePreview} />
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

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Update Post</Text>
        )}
      </TouchableOpacity>
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  input: {
    width: '90%',
    margin: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  captionInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
    width: '90%',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
  imagePreview: {
    width: '90%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
});

export default EditPost;

    // const formData = new FormData();
    // formData.append('image', {
    //   uri: image,
    //   name: 'image.jpg',
    //   type: 'image/jpg',
    // } as any);
  
    // axios.post('http://<your-computer-ip>:3000/api/posts', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // })
    // .then(response => {
    //   console.log('Response:', response.data);
    // })
    // .catch(error => {
    //   console.error('Error uploading image:', error);
    // });