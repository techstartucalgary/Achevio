import React from 'react';
import { useState } from 'react';
import { View, Image, StyleSheet, Button, Text,TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";


export default function PhotoPreviewPage() {
    const route = useRouter();
    const params = useLocalSearchParams();
    const photoUri = params.photoUri;
    const [image, setImage] = useState(photoUri);


    return (
      <View style={styles.container}>
        {/* Image covering the entire screen */}
        <Image source={{ uri: image.toString() }} style={styles.image} />
      <Text style={styles.instructions}>Here's your picture!</Text>
        {/* Semi-transparent overlay with buttons */}
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.button} onPress={() => 
            router.push('/Camera')}>

            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {
            /* Implement proceed action */
            }}>
            <Text style={styles.buttonText}>Proceed</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black', // This will be the color behind the image if it doesn't cover the entire screen due to aspect ratio
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
        width: '100%', // Adjust as needed
        height: '80%', // Adjust as needed
        resizeMode: 'contain',
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
