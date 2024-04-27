import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, StatusBar, Dimensions, ActivityIndicator } from 'react-native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { Link, router, useFocusEffect} from "expo-router";
import * as Location from 'expo-location';
import { useDispatch, useSelector } from 'react-redux';
import TutorialSteps from '../../components/TutorialMode';

export default function CameraPage() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [isRecording, setIsRecording] = useState(false); // Add state for video recording
  const cameraRef = useRef<Camera>(null);
  const [isFocused, setIsFocused] = useState(false);
  const doneTutorial = useSelector((state: any) => state.user.me.done_tutorial);
  const [showTutorial, setShowTutorial] = useState(!doneTutorial);
  const dispatch = useDispatch();
  useEffect(() => {
    if (doneTutorial) {
      setShowTutorial(false);
    }
  }, [doneTutorial]);
   const completeTutorial = () => {
    setShowTutorial(false);
  };
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
      const photoData = await cameraRef.current.takePictureAsync({
        quality: 0.5, // Lower quality
      });
  
      let uri = photoData.uri;
      // Automatically mirror the image if using the front camera
      if (type === CameraType.front) {
        const mirroredImage = await manipulateAsync(
          uri,
          [{ flip: FlipType.Horizontal }],
          { format: SaveFormat.JPEG }
        );
        uri = mirroredImage.uri; // Use the mirrored image URI for further processing
      }
      else {
        const resizedPhoto = await manipulateAsync(
          photoData.uri,
          [{ resize: { width: 800 } }],
          { compress:1, format: SaveFormat.JPEG }
        
        );
        uri = resizedPhoto.uri;
      }  
  
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
    {showTutorial && <TutorialSteps visible={showTutorial} pageContext="camera"/>}

    {isFocused && (
      <Camera style={styles.camera} type={type} flashMode={flashMode} ref={cameraRef} />
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

