import React, { useState } from "react";
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Link } from "expo-router";
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

  const postSignupInfo = async () => {
    console.log("signup has been pressed"); // for debugging
    if (!validateInput()) {
      console.log("validateInput failed"); // for debugging
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://10.13.103.218:8000/user",
        {
          username,
          password,
          email,
          first_name: "Magdy",
          last_name: "Hafez",
        },
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Signup successful!");
        // handle successful signup, like navigation or clearing the form
      } else {
        Alert.alert("Error", response.data.detail || "An unexpected error occurred.");
      }
    } catch (error) {
      console.log("Error details:", error);
      // Check for additional details
      if (error.response) {
        // The request was made and the server responded with a status code
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  const getRequest = async () => {
    try {
      const response = await axios.post(
        "http://10.13.103.218:8000/user",
        {
          username: "magdy",
          password: "magdy",
          email: "siyfg",
          first_name: "Magdy",
          last_name: "Hafez",
        },
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
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
          <Image source={require("../../assets/images/temp_rocket.png")} style={styles.image} />
          <Text style={styles.title}>Glad to have you on board !</Text>
          <Text style={styles.subheading}>
            But first we would like to get to know a little bit more about you{" "}
          </Text>
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
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            placeholderTextColor="#343a40"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            placeholderTextColor="#343a40"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            placeholder="Confirm Password"
            placeholderTextColor="#343a40"
            secureTextEntry
          />
          <TouchableOpacity style={styles.signupBtn} onPress={getRequest} disabled={isLoading}>
            <Text style={styles.signupText}>Signup</Text>
          </TouchableOpacity>
          <Text style={styles.navText}>---------------- OR ----------------</Text>
          <Link href="/" style={styles.linkstyle}>
            <Text style={styles.loginText}>Go back to Login</Text>
          </Link>

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
    color: "#fffeeb",
  },
  subheading: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 20,
    color: "#fffeeb",
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    backgroundColor: "#fffeeb",

    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 20,
  },
  signupBtn: {
    width: "100%",
    height: 40,
    backgroundColor: "#a2d2ff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 12,
  },
  signupText: {
    fontSize: 18,
    color: "#fffeeb",
    fontWeight: "bold",
  },
  loginText: {
    fontSize: 16,
    color: "#fffeeb",
    fontWeight: "500",
  },
  navText: {
    color: "#fffeeb",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
  linkStyle: {
    fontSize: 16,
    color: "#fffeeb",
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
