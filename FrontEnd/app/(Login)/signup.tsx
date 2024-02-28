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
import { useSelector, useDispatch } from "react-redux";
import { setUsername, setUrl } from "../redux/actions";
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
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localUsername, setLocalUsername] = useState("");
  const [localEmail, setLocalEmail] = useState("");
  const [localPassword, setLocalPassword] = useState("");
  const [localConfirmPassword, setLocalConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { url, username } = useSelector((state: any) => state.user);

  const validateInput = () => {
    if (!localEmail || !localUsername || !localPassword || !localConfirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return false;
    }
    if (localPassword !== localConfirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return false;
    }
    // Add any additional validation here
    return true;
  };

  const postSignupInfo = async () => {
    if (!validateInput()) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${url}/user`,
        {
          username: localUsername,
          password: localPassword,
          email: localEmail,
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
        dispatch<any>(setUsername(localUsername));
      } else {
        Alert.alert("Error", response.data.detail || "An unexpected error occurred.");
      }
    } catch (error) {
      // Check for additional details
      if (error.response) {
        // The request was made and the server responded with a status code
      } else if (error.request) {
        // The request was made but no response was received
      } else {
        // Something happened in setting up the request that triggered an Error
      }
    } finally {
      setIsLoading(false);
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
            onChangeText={setLocalUsername}
            value={localUsername}
            placeholderTextColor="#343a40"
            placeholder="Username"
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
          <TouchableOpacity style={styles.signupBtn} onPress={postSignupInfo} disabled={isLoading}>
            <Text style={styles.signupText}>Continue</Text>
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
    color: "#fffeeb",
  },
  subheading: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 20,
    color: "#fffeeb",
    textAlign: "center",
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
