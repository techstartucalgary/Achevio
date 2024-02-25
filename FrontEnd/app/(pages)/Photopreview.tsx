import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, router } from "expo-router";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from 'expo-image';

export default function PhotoPreviewPage() {
  const params = useLocalSearchParams();
  const photoUri = params.photoUri;
  const image = useMemo(() => photoUri, []);
  const fadeAnim = useState(new Animated.Value(0))[0]; // Initial opacity for animations

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const handleSubmit = () => {
    router.push({
      pathname: "/EditPost",
      params: { photoUri: image },
    });
  };
  const compliments = [
    "You look great today!",
    "You're a smart cookie.",
    "I bet you make babies smile.",
    "You have impeccable manners.",
    "I like your style.",
    "You have the best laugh.",
    "I appreciate you.",
    "You are the most perfect you there is.",
    "You are enough.",
    "You're strong.",
    "Your perspective is refreshing.",
    "You're an awesome friend.",
    "You light up the room.",
    "You deserve a hug right now.",
    "You should be proud of yourself.",
  ];
  const Randomcompliments =
    compliments[Math.floor(Math.random() * compliments.length)];
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: image.toString() }}
        style={styles.image}
        onLoad={fadeIn}
      />
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.gradientOverlay}
        >
          <Text style={styles.instructions}>{Randomcompliments}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/Camera")}
            >
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Proceed</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  image: {
    width: screenWidth,
    height: 600,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
    borderRadius: 12,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
  },
  gradientOverlay: {
    width: "100%",
    paddingBottom: 50,
    paddingTop: 20,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  button: {
    backgroundColor: "#06bcee",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  instructions: {
    fontSize: 18,
    color: "white",
    marginBottom: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
  },
});
