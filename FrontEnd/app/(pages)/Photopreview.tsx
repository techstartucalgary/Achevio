import React, { useState, useMemo } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, router } from "expo-router";
import axios from 'axios';

export default function PhotoPreviewPage() {
  const params = useLocalSearchParams();
  const photoUri = params.photoUri;
  const image = useMemo(() => photoUri, []);
  const handleSubmit = () => {
    router.push({
      pathname: '/EditPost',
      params: {
        photoUri: image,
      },
    })
  };
  
  return (
    <View style={styles.container}>
      <Image source={{ uri: image.toString() }} style={styles.image} />
      <Text style={styles.instructions}>Here's your picture!</Text>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/Camera')}>
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Proceed</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: 'black', // This will be the color behind the image if it doesn't cover the entire screen due to aspect ratio
    },
    captionInput: {
      height: 50,
      margin: 12,
      borderWidth: 1,
      borderColor: '#fff',
      padding: 10,
      color: '#fff',
      borderRadius: 10,
      backgroundColor: '#ffffffa0', // Semi-transparent white
    },
    overlay: {
      position: 'absolute', 
      bottom: 50, // Adjust as needed
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    button: {
      backgroundColor: "#ffffffa0", // Semi-transparent white
      padding: 15,
      borderRadius: 20,
      marginHorizontal: 20,
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      marginHorizontal: 0,
      marginTop: 0,
    },
    
      instructions: {
        fontSize: 18,
        margin: 10,
      },
    buttonText: {
      fontSize: 18,
      color: '#000',
    },
  });
