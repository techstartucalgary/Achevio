import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';

const EditPost = () => {
  const [caption, setCaption] = useState('');
  const params = useLocalSearchParams();
  const photoUri = params.photoUri;

  const handleSubmit = () => {
    // Handle the submission logic here
    console.log('Caption:', caption);
    // Add logic to update the post
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>Edit Your Post</Text>
      <TextInput
        style={styles.captionInput}
        onChangeText={setCaption}
        value={caption}
        placeholder="Add a caption..."
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Update Post</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  captionInput: {
    height: 200,
    width: '80%',
    margin: 12,
    borderWidth: 1,
    borderColor: '#333',
    padding: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#aaa",
    padding: 15,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
  instructions: {
    fontSize: 18,
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