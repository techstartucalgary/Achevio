// Modal.tsx
import React, { useState } from "react";
import { StatusBar, TextInput, Button, StyleSheet } from "react-native";
import { View, Text } from "../components/Themed";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Signup: undefined; 
  Login: undefined;
};
type SignupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Signup"
>;

type Props = {
  navigation: SignupScreenNavigationProp;
};

export default function appInfo({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Info</Text>
      <Text style={styles.text}>This app was created by:</Text>
      <Text style={styles.text}>
        This app was created using the following technologies:
      </Text>
      <Text style={styles.text}>React Native</Text>
      <Text style={styles.text}>Expo</Text>
      <Text style={styles.text}>TypeScript</Text>
      <Text style={styles.text}>React Navigation</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20, // add padding around the edges
    backgroundColor: "#F5F5F5", // consider a non-white background to be easier on the eyes
  },
  title: {
    fontSize: 24, // slightly larger title
    fontWeight: "700", // bolder title
    color: "#333", // change color for better visibility or according to your theme
    marginBottom: 20, // space before the next element
  },
  text: {
    fontSize: 18, // larger font size for better readability
    fontWeight: "500",
    color: "#555", // slightly muted text color
    marginBottom: 10, // space between text lines
    textAlign: "center", // center-align text
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
    backgroundColor: "#CED0CE", // add color to your separator
  },
});
