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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Link, router } from "expo-router";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

type RootStackParamList = {
  Signup: undefined;
  Login: undefined;
  // ... other screen definitions
};

type SignupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Signup"
>;

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
export default function Signup2Screen(props) {
  const [username, setUsername] = useState(props.username);
  const [first_name, setFirstName] = useState(props.first_name);
  const [last_name, setLastName] = useState(props.last_name);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const url = useSelector((state: any) => state.user.url);

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
    if (!validateInput()) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${url}/user`,
        {
          username: username,
          first_name: first_name,
          last_name: last_name,
          password: password,
          email: email,
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
        const response = await axios.get(`${url}/user/me`);
        dispatch({ type: "SET_ME", payload: response.data }); // Fix dispatch call
        dispatch({ type: "UPDATE_USERNAME", userName: username });
        dispatch({ type: "UPDATE_PASSWORD", passWord: password });
        if (response.data.done_tutorial === false) {
          router.push("/(Tutorial)/settingUpPage");
        } else {
          router.push("/(tabs)/Camera");
        }
      } else {
        Alert.alert(
          "Error",
          response.data.detail || "An unexpected error occurred."
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred during signup.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardView}
    >
      <View style={styles.container}>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <Text style={styles.title}>Signup</Text>
            <Image
              source={require("../../assets/images/temp_rocket.png")}
              style={styles.image}
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
            <TouchableOpacity
              style={styles.signupBtn}
              onPress={postSignupInfo}
              disabled={isLoading}
            >
              <Text style={styles.signupText}>Signup</Text>
            </TouchableOpacity>
            <Text style={styles.navText}>
              ---------------- OR ----------------
            </Text>
            <Link href="/login" asChild>
              <Pressable>
                <Text style={styles.navText}>Go back to Login</Text>
              </Pressable>
            </Link>
            <StatusBar backgroundColor="#000000" barStyle="light-content" />
          </>
        )}
      </View>
    </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
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
