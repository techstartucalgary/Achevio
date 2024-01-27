import React, { useState } from "react";
import {
  Image,
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Pressable,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

import { Link, router } from "expo-router";
import axios from "axios";

type RootStackParamList = {
  Signup: undefined;
  Login: undefined;
  // ... other screen definitions
};

type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, "Signup">;

type Props = {
  navigation: SignupScreenNavigationProp;
};

type signupData = {
  communities: [];
  email: string;
  first_name: string;
  last_name: string;
  id: string;
  username: string;
  password: string;
  detail: string;
};
export default function SignupScreen() {
  const [username, setUsername] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateInput = () => {
    if (!email || !username || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return false;
    }
    // Add any additional validation here (e.g., email format, password strength)
    return true;
  };

  const getRequest = async () => {
    try {
      const response = await axios.get("http://10.13.85.26:8000/user");
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Text style={styles.title}>Signup</Text>
          <Image source={require("../../assets/images/temp_rocket.png")} style={styles.image} />

          <TextInput
            style={styles.input}
            onChangeText={setUsername}
            value={username}
            placeholder="Username"
            placeholderTextColor="#343a40"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            onChangeText={setFirstName}
            value={first_name}
            placeholder="First Name"
            placeholderTextColor="#343a40"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            onChangeText={setLastName}
            value={last_name}
            placeholder="Last Name"
            placeholderTextColor="#343a40"
            autoCapitalize="none"
          />

          <Link href="/login" asChild>
            <Pressable style={styles.signupBtn}>
              <Text style={styles.signupText}>Continue</Text>
            </Pressable>
          </Link>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/index",
                params: { slide: 1 },
              })
            }>
            <Text style={styles.navText}>Go back to Login</Text>
          </Pressable>
          <StatusBar backgroundColor="#000000" barStyle="light-content" />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#03214a",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  input: {
    height: 50,
    borderColor: "gray",
    backgroundColor: "#fffeeb",
    borderWidth: 1,
    marginBottom: 20,
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 20,
    color: "#333",
  },
  signupBtn: {
    width: "100%",
    backgroundColor: "#a2d2ff",
    padding: 15,
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 10,
  },
  signupText: {
    fontSize: 18,
    color: "#000",
  },

  navText: {
    color: "#fffeeb",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
  loginText: {
    fontSize: 16,
    color: "#6200EE",
    fontWeight: "500",
  },

  linkStyle: {
    fontSize: 16,
    color: "#6200EE",
    fontWeight: "500",
  },
  errorStyle: {
    fontSize: 14,
    color: "#ee0008",
    fontWeight: "500",
    marginBottom: 6,
    marginTop: -4,
  },
  linkstyle: {
    marginTop: 20,
  },

  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
});
