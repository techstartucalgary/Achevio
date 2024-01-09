import React, {useState} from "react";
import {Alert, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View,} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {Link} from "expo-router";
import axios from "axios";

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
  communities:[],
  email: string,
  first_name:string,
  last_name: string,
  id: string,
  username:string,
  password:string,
  detail:string
}
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
    if (!validateInput()){
      console.log("validateInput failed"); // for debugging
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/user', {
        username,
        password,
        email,
        first_name: "Magdy",
        last_name: "Hafez",
      }, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

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
        console.log('Error', error.message);
      }    
    } finally {
      setIsLoading(false);
    }
  };
  const getRequest = async () => {
    try {
      const response = await axios.get('http://172.18.0.1:8000/user');
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
      {isLoading? (
        <Text>Loading...</Text>
      ) : (
        <>
        <Text style={styles.title}>Signup</Text>
        <TextInput
          style={styles.input}
          onChangeText={setUsername}
          value={username}
          placeholder="Username"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          placeholder="Confirm Password"
          secureTextEntry
        />
        <TouchableOpacity
        style={styles.signupBtn}
        onPress={getRequest}
        disabled={isLoading}
        >
          <Text style={styles.signupText}>Signup</Text>
        </TouchableOpacity>
  
        <Link href="/" style={styles.linkstyle}>
          <Text style={styles.loginText}>Go to Login</Text>
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
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
  signupBtn: {
    width: "100%",
    height: 50,
    backgroundColor: "#6200EE",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginBottom: 12,
  },
  signupText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  loginText: {
    fontSize: 16,
    color: "#6200EE",
    fontWeight: "500",
  },

  linkStyle:{
    fontSize: 16,
    color: "#6200EE",
    fontWeight: "500",
  },
  errorStyle:{
    fontSize: 14,
    color: "#ee0008",
    fontWeight: "500",
    marginBottom: 6,
    marginTop: -4,
  },
  linkstyle:{
    marginTop: 20,
  }
  
});
