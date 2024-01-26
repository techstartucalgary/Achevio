import React from "react";
import { View, Text } from "../../components/Themed";
import { Image, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Landing = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/temp_icon_full.png")} style={styles.image} />

      <Text style={styles.title}>Acheivio</Text>
      <Text style={styles.subheading}>Reach for the stars</Text>
      <Pressable
        style={styles.navText}
        // onPress={() =>
        //   navigation.push("/login", { slide: 1 })}
      >
        <Text>Login</Text>
      </Pressable>
      <Pressable
        style={styles.navText}
        // onPress={() =>
        //   navigation.push({
        //     pathname: "/signup",
        //     params: { slide: 1 },
        //   })
        // }
      >
        <Text>Signup</Text>
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
    backgroundColor: "#a2d2ff",
    padding: 15,
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 10,
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
