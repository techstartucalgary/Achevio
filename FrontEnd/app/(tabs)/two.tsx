import React, { useState } from "react";
import {
  StatusBar,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Link } from "expo-router";
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

type Response = {
  status: number,
  data: object,
}

export default function SignupScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessageVisible, setErrorMessageVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const postNewUserInfo = async () => {
    try {
      const configurationObject = {
        method: 'get',
        url: `https://reactnative.dev/movies.json`,
        param: {
          username: username,
          password: password
        }
      };
      const response:Response = await axios(configurationObject);
      console.log(response.status, response.data);
      return response
    } catch (error:any) {
      // console.error(error);
      const eMessage = error.toString()
      return {status: parseInt(eMessage.slice(eMessage.length-3, eMessage.length)), data:{}}
    }
  };
  function formatCheck() {
    let checkResult:boolean = true
    // console.log(username, password, confirmPassword)
    if(username.length === 0 || password.length === 0 || confirmPassword.length === 0) {
      // handle empty input
      checkResult = false
      setErrorMessageVisible(true)
      setErrorMessage("Please filling username and password")
    }
    else if(confirmPassword !== password){
      // handle inconsistent password
      checkResult = false
      setErrorMessageVisible(true)
      setErrorMessage("Inconsistent password")
    }
    return checkResult
  }

  function responseCheck(response:Response) {
    let checkResult:boolean = true
    if (response.status === 400){
      checkResult = false
      setErrorMessageVisible(true)
      setErrorMessage("Username does exist")
    }
    else if(response.status === 404 ){
      checkResult = false
      setErrorMessageVisible(true)
      setErrorMessage("Connection error please try later!")
    }
    return checkResult;
  }

  return (
    <View style={styles.container}>
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
      {
        errorMessageVisible ?
            <Text style={styles.errorStyle}>
              {errorMessage}
            </Text>
            : null
      }
      <TouchableOpacity
        style={styles.signupBtn}
        onPress={async () => {
          /* handle signup */
          if (formatCheck()){
            const res = await postNewUserInfo()
            if (responseCheck(res)){
              //navigate to main page
              setErrorMessageVisible(false)
              }
          }
        }}
      >
        <Text style={styles.signupText}>Signup</Text>
      </TouchableOpacity>

      <Link href="/" style={styles.linkStyle}>
        <Text style={styles.loginText}>Go to Login</Text>
      </Link>

      <StatusBar backgroundColor="#000000" barStyle="light-content" />

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
  }
});
