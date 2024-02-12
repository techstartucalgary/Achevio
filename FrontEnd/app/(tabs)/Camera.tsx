import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, StatusBar, Image, Dimensions, ActivityIndicator } from 'react-native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { Link, router} from "expo-router";
import { useFocusEffect } from '@react-navigation/native';

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
  const [isFocused, setIsFocused] = useState(false);
const [isLoading, setIsLoading] = useState(false);


  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );
  
  useFocusEffect(
    useCallback(() => {
      let isActive = true; // Flag to manage component's active state

      const initCamera = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (isActive && status === 'granted') {
          setHasPermission(true);
          // Re-initialize any other camera settings here
        } else {
          setHasPermission(false);
        }
      };
  
      initCamera();

      return () => {
        isActive = false; // Cleanup: Mark component as inactive
        // Additional cleanup logic if needed
      };
    }, [])
  );

  
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
      console.log('Taking picture');
      setIsLoading(true); // Start loading
      const photoData = await cameraRef.current.takePictureAsync();
      console.log('photoData:', photoData);
  
      let uri = photoData.uri;
  
      // Automatically mirror the image if using the front camera
      if (type === CameraType.front) {
        console.log('Mirroring image');
        const mirroredImage = await manipulateAsync(
          uri,
          [{ flip: FlipType.Horizontal }], // Flip horizontally to mirror the image
          { format: SaveFormat.JPEG }
        );
        console.log('Mirrored image:', mirroredImage);
        uri = mirroredImage.uri; // Use the mirrored image URI for further processing
      }
  
      setIsLoading(false); // End loading
  
      // Proceed to use the image URI as needed, for example, navigating to a preview screen
      router.push({
        pathname: '/(pages)/Photopreview', // The route name
        params: { photoUri: uri }, // Parameters as an object
      });
    }
  };
  
  return (
<View style={styles.container}>
    <StatusBar barStyle="light-content" />
    {isFocused && (
      <Camera style={styles.camera} type={type} flashMode={flashMode} ref={cameraRef} />
    )}
    {isLoading && (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )}
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
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  camera: {
    width: screenWidth,
    height: 550,
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
    bottom: 35,
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