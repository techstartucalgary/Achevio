import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, StatusBar, Image, Dimensions } from 'react-native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { Link, router} from "expo-router";
type RootStackParamList = {
    Signup: undefined;
    Login: undefined;
    Preview: { photoUri: string };  // Define the parameters expected by the Preview screen
    // ... other screen definitions
  };
  
  const Stack = createStackNavigator<RootStackParamList>();
  
// Define the type for the navigation prop specific to this stack
type NavigationProp = StackNavigationProp<RootStackParamList>;

function useTypedNavigation() {
  return useNavigation<NavigationProp>();
}
export default function CameraPage() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [isRecording, setIsRecording] = useState(false); // Add state for video recording
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      // if camera is not on then turn it on
      
    })();
  }, []);
  useEffect(() => {
    if (hasPermission) {
      setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }
  }, [hasPermission]);
  
  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  // Toggle Camera Type
  const toggleCameraType = () => {
    setType(
      type === CameraType.back
        ? CameraType.front
        : CameraType.back
    );
  };

  // Toggle Flash
  const toggleFlash = () => {
    setFlashMode(
      flashMode === FlashMode.off
        ? FlashMode.on
        : FlashMode.off
    );
  };
  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      const videoRecordPromise = cameraRef.current.recordAsync();
      videoRecordPromise.then((data) => {
        setIsRecording(false);
        // Handle the recorded video data (e.g., save or upload)
        console.log(data.uri);
        router.push({
          pathname: '/(pages)/Videopreview',
          params: { videoUri: data.uri }, // Parameters as an object
        });
      });
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };
  // Capture Photo
  const takePicture = async () => {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync();
      const uri = photoData.uri;
      // If the front camera was used, flip the image
      if (type === CameraType.front) {
        const flippedImage = await flipImage(uri);
        router.push({
          pathname: '/(pages)/Photopreview', // The route name
          params: { photoUri: flippedImage.uri }, // Parameters as an object
        });
        } else {
        router.push({
          pathname: '/(pages)/Photopreview', // The route name
          params: { photoUri: uri }, // Parameters as an object
        });
      }
    }
  };
  
  
  const flipImage = async (uri: string) => {
    // Flip the image horizontally
    const manipResult = await manipulateAsync(
      uri,
      [{ flip: FlipType.Horizontal }],
      { compress: 1, format: SaveFormat.PNG }
    );
    return manipResult;
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Camera style={styles.camera} type={type} ratio='4:3' flashMode={flashMode} ref={cameraRef} >
      </Camera>
      <View style={styles.buttonContainer}>
          {/* Capture Button */}
          <TouchableOpacity
          style={styles.captureButton}
          onPress={takePicture}  // Changed to onPress for capturing photo
          onLongPress={startRecording}
          onPressOut={stopRecording}
        >
          <FontAwesome name={isRecording ? 'stop-circle' : 'circle'} size={isRecording ? 50 : 24} color={isRecording ? 'red' : 'black'} />
        </TouchableOpacity>

          {/* Toggle Camera Type */}
          <TouchableOpacity style={styles.toggleButton} onPress={toggleCameraType}>
            <MaterialIcons name="flip-camera-ios" size={24} color="white" />
          </TouchableOpacity>

          {/* Flash Button */}
          <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
            <MaterialIcons name={flashMode === 'off' ? 'flash-off' : 'flash-on'} size={24} color="white" />
          </TouchableOpacity>
        </View>

    </View>
  );
}
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    width: screenWidth,
    height: 600,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    borderRadius: 12, 
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },

  captureButton: {
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 50,
    alignSelf: 'center',
  },
  toggleButton: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  flashButton: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  preview: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  },
});