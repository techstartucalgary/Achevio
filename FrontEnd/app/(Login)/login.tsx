import React, { useRef, useState } from "react";
import {
  Image,
  Keyboard,
  Pressable,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Link, router } from "expo-router";
import { Text, View } from "../../components/Themed";
import GoogleLoginButton from "../../components/googleLoginButton";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUsername, setUrl } from "../redux/actions";
type RootStackParamList = {
  Signup: undefined;
  Login: undefined;
  modal: undefined;
  Camera: undefined;
};

type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, "Signup">;

type Props = {
  navigation: SignupScreenNavigationProp;
};
export default function LoginScreen() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageVisible, setErrorMessageVisible] = useState(false);
  const { url, username } = useSelector((state: any) => state.user);
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [inputUsername, setInputUsername] = useState(username || "");

  const dispatch = useDispatch();
  type LoginResponse = {
    status: number;
    data: LoginData;
  };

  type LoginData = {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    detail: string;
  };

  async function postLoginInfo(username: string, password: string): Promise<LoginResponse | null> {
    try {
      const configurationObject = {
        method: "post",
        url: `${url}/login`,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        data: { username, password },
      };

      const response = await axios(configurationObject);
      if (response.status === 201) {
        return {
          status: response.status,
          data: response.data,
        };
      } else {
        // Handle other statuses as needed
        setErrorMessage("Unexpected response status: " + response.status);
        setErrorMessageVisible(true);
        return null;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Extracting error details from axios error object
        const serverError = error as any;
        if (serverError && serverError.response) {
          console.error("Error response: ", serverError.response.status, serverError.response.data);
          setErrorMessage(serverError.response.data.detail || "An error occurred");
          setErrorMessageVisible(true);
        } else {
          console.error("Error: ", error);
          setErrorMessage("An error occurred");
          setErrorMessageVisible(true);
        }
      }
      return null;
    }
  }
  function responseCheck(response: LoginResponse): boolean {
    let checkResult: boolean = true;
    if (response.status !== 201) {
      checkResult = false;
      setErrorMessage(response.data.detail);
    }
    return checkResult;
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const resetInputsAndFocus = () => {
    setInputUsername("");
    setPassword("");
    usernameInputRef.current?.focus(); // Focus on the username input after reset
  };
  async function onPressLoginButton() {
    setLoading(true);
    dismissKeyboard(); // Ensure keyboard is dismissed to prevent focus issues
    const res = await postLoginInfo(inputUsername, password);
    setLoading(false);
    if (res && responseCheck(res)) {
      setErrorMessageVisible(false);
      dispatch({ type: "SET_USERNAME", payload: inputUsername });
      const response = await axios.get(`${url}/user/me`);
      dispatch({ type: "SET_USERID", payload: response.data.id });
      router.push("/(tabs)/Camera");
    } else {
      resetInputsAndFocus(); // Reset inputs and focus if login fails
    }
  }
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Image source={require("../../assets/images/temp_rocket.png")} style={styles.image} />
        <Text style={styles.title}>Welcome Back!</Text>
        <TextInput
          ref={usernameInputRef}
          style={styles.input}
          onChangeText={setInputUsername}
          value={inputUsername}
          placeholder="Username"
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
          autoCapitalize="none"
        />
        {errorMessageVisible ? <Text style={styles.errorStyle}>{errorMessage}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={onPressLoginButton}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        {loading ? <ActivityIndicator size="large" color="#0000ff" /> : <GoogleLoginButton />}
        <Text style={styles.navText}>---------------- OR ----------------</Text>
        <Link href="/signup" asChild>
          <Pressable>
            <Text style={styles.navText}>Go to Signup</Text>
          </Pressable>
        </Link>

        <StatusBar backgroundColor="#000000" barStyle="light-content" />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#03214a",
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
  button: {
    width: "100%",
    backgroundColor: "#a2d2ff",
    padding: 15,
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#000",
  },
  navText: {
    color: "#fffeeb",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
  errorStyle: {
    fontSize: 14,
    color: "#ee0008",
    fontWeight: "500",
    marginBottom: 6,
    marginTop: -4,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
});
