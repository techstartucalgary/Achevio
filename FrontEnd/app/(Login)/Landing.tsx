import React from "react";
import { View, Text } from "../../components/Themed";
import { Image, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";

const Landing = () => {
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/temp_icon_full.png")} style={styles.image} />

      <Text style={styles.title}>Acheivio</Text>
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
    marginBottom: 20,

    // fit the entire image within the container
    resizeMode: "contain",
  },
});

export default Landing;
