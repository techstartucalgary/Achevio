import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { useLocalSearchParams, router } from 'expo-router';

export default function VideoPreviewPage() {
  const params = useLocalSearchParams();
  const videoUri = params.videoUri; // Assuming you pass the video URI as 'videoUri'

  const handleRetake = () => {
    router.push('/Camera');
  };

  const handleProceed = () => {
    // Handle the video and proceed
  };

  return (
    
    <View style={styles.container}>
      <Video
        source={{ uri: videoUri.toString() }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        shouldPlay
        isLooping
        style={styles.video}
      />
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.button} onPress={handleRetake}>
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleProceed}>
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
    backgroundColor: 'black',
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#ffffffa0',
    padding: 15,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
  },
});
