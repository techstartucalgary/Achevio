import React, {useState} from "react";
import {Alert, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View,} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {Link} from "expo-router";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUsername,setUrl } from "../redux/actions";
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
    console.log("signup has been pressed"); // for debugging
    if (!validateInput()){
      console.log("validateInput failed"); // for debugging
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${url}/user`, {
        username: localUsername,
        password: localPassword,
        email: localEmail,
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
        dispatch<any>(setUsername(localUsername));
      }
       else {
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
  return (
    <View style={styles.container}>
      {isLoading? (
        <Text>Loading...</Text>
      ) : (
        <>
        <Text style={styles.title}>Signup</Text>

        <TextInput
          style={styles.input}
          onChangeText={setLocalUsername}
          value={localUsername}
          placeholder="Username"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          onChangeText={setLocalEmail}
          value={localEmail}
          placeholder="Email"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          onChangeText={setLocalPassword}
          value={localPassword}
          placeholder="Password"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          onChangeText={setLocalConfirmPassword}
          value={localConfirmPassword}
          placeholder="Confirm Password"
          secureTextEntry
        />

        <TouchableOpacity
        style={styles.signupBtn}
        onPress={postSignupInfo}
        disabled={isLoading}
        >
          <Text style={styles.signupText}>Signup</Text>
        </TouchableOpacity>
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
