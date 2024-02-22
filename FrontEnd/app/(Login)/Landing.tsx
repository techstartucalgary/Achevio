import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  Easing,
} from "react-native";

const { width, height } = Dimensions.get("window");

const Landing = () => {
  const navigation = useNavigation();

  const stars = useRef(
    Array.from({ length: 20 }, (_, index) => ({
      id: index,
      left: Math.random() * width,
      top: Math.random() * height,
      opacity: new Animated.Value(1),
    }))
  );

  const animatedValues = useRef(stars.current.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = animatedValues.map((value, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );
    });

    Animated.stagger(150, animations).start();
  }, [animatedValues]);

  // Filter stars to include only those in the top half of the screen
  const topHalfStars = stars.current.filter((star) => star.top < height / 1.5);

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {topHalfStars.map((star, index) => (
          <Animated.Image
            key={star.id}
            source={require("../../assets/images/star1.png")}
            style={[
              styles.star,
              {
                left: star.left,
                top: star.top,
                opacity: animatedValues[index],
              },
            ]}
          />
        ))}
      </View>
      <Image source={require("../../assets/images/temp_icon_full.png")} style={styles.image} />
      <Text style={styles.title}>Achievio</Text>
      <Text style={styles.subheading}>Reach for the stars</Text>
      <Pressable style={styles.navText} onPress={() => navigation.navigate("Login", { slide: 1 })}>
        <Text style={styles.navTextsize}>Login</Text>
      </Pressable>
      <Pressable style={styles.navText} onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.navTextsize}>Signup</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#03214a",
    paddingHorizontal: 20,
    position: "absolute",
    width,
    height,
  },
  starsContainer: {
    ...StyleSheet.absoluteFillObject,
  },

  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  navText: {
    width: "100%",
    fontSize: 18,
    backgroundColor: "#a2d2ff",
    padding: 15,
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 10,
  },
  navTextsize: {
    fontSize: 18,
    color: "#000",
  },
  image: {
    width: 400,
    height: 400,
    marginBottom: 10,
    resizeMode: "contain",
    zIndex: 1,
  },
  star: {
    width: 45, // Adjust the size of the stars as needed
    height: 45,
    position: "absolute",
    zIndex: 2,
  },
});

export default Landing;
