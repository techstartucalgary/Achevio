import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Pressable, Animated, Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Landing = () => {
  const [stars] = useState([
    {
      id: 1,
      opacity: new Animated.Value(1),
      left: new Animated.Value(screenWidth * 0.1),
      top: new Animated.Value(screenHeight * 0.1),
    },
    {
      id: 2,
      opacity: new Animated.Value(1),
      left: new Animated.Value(screenWidth * -0.3),
      top: new Animated.Value(screenHeight * -0.3),
    },

    {
      id: 3,
      opacity: new Animated.Value(1),
      left: new Animated.Value(screenWidth * 0.5),
      top: new Animated.Value(screenHeight * -0.5),
    },
    {
      id: 4,
      opacity: new Animated.Value(1),
      left: new Animated.Value(screenWidth * -0.6),
      top: new Animated.Value(screenHeight * 0.6),
    },
    {
      id: 5,
      opacity: new Animated.Value(1),
      left: new Animated.Value(screenWidth * 0.9),
      top: new Animated.Value(screenHeight * -0.5),
    },
  ]);

  useEffect(() => {
    animateStars();
  }, []);

  const animateStars = () => {
    stars.forEach((star) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.parallel([
          Animated.timing(star.left, {
            toValue: Math.random() * 300,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(star.top, {
            toValue: Math.random() * 300,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  };

  return (
    <View style={styles.container}>
      {stars.map((star) => (
        <Animated.Image
          key={star.id}
          source={require("../../assets/images/star1.png")} // Replace with your star image source
          style={[
            styles.star,
            {
              opacity: star.opacity,
              transform: [{ translateX: star.left }, { translateY: star.top }],
            },
          ]}
        />
      ))}
      <Image source={require("../../assets/images/temp_icon_full.png")} style={styles.image} />

      <Text style={styles.title}>Achievio</Text>
      <Text style={styles.subheading}>Reach for the stars</Text>
      <Pressable
        style={styles.navText}
        onPress={() =>
          router.push({
            pathname: "/login",
            params: { slide: 1 },
          })
        }>
        <Text style={styles.navTextsize}>Login</Text>
      </Pressable>
      <Pressable
        style={styles.navText}
        onPress={() =>
          router.push({
            pathname: "/signup",
          })
        }>
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
