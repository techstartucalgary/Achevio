import React, {useEffect, useState} from "react";
import {
  StatusBar,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable, // Add Pressable
} from "react-native";
import { Text, View } from "../../components/Themed";
import { Link } from "expo-router"; // Import Link from expo-router

import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";

type RootStackParamList = {
  Signup: undefined; // undefined because you don't pass any parameters to this screen
  Login: undefined;
  modal: undefined;
  // ... other screen definitions
};
type SignupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Signup"
>;

type Props = {
  navigation: SignupScreenNavigationProp;
};

type Response ={
  status: string,
  data: string
};
export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginState, setLoginState] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")


  useEffect(()=>{
    if (loginState){
      // for successful login


    }
    else {
      // for unsuccessful login


    }
  }, [loginState])


  async function postLoginInfo(){
    try {

      const configurationObject = {
        method: 'post',
        url: `https://reactnative.dev/movies.json`,
        'Content-Type': 'application/json',
        param: {
          username: username,
          password: password
        }
      };
      const response:Response = await axios(configurationObject);
      console.log(response)
      return response
    }catch (error) {
      console.error(error)
      return {status: 400, data:{}}
    }
  }

  // Function to dismiss keyboard
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
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
          autoCapitalize="none"
        />
        <Text >
          {errorMessage}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            /* handle login */
            const response = await postLoginInfo()
            console.log(response.status)
            if (response.status === 200){
              //navigate to main page
            }
            if (response.status === 400){
              setErrorMessage("Request failed")
            }
          }}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Link href="/two" asChild>
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
    padding: 20, // Add padding to avoid elements being too close to the screen edge
    backgroundColor: "#fff", // or whatever your background color is
  },
  title: {
    fontSize: 24, // larger font size
    fontWeight: "bold",
    marginBottom: 20, // Add some space below the title
    color: "#333", // or whatever your text color is
  },
  input: {
    height: 50, // Increased input height
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20, // Increase space between inputs
    width: "100%", // Make input take full width
    paddingHorizontal: 10, // Add some padding inside the input
    borderRadius: 5, // Round the corners
    color: "#333", // or whatever your text color is
  },
  button: {
    width: "100%", // Full width button
    backgroundColor: "#6200EE", // A color that matches your theme
    padding: 15, // Padding inside
    alignItems: "center", // Center the text within
    borderRadius: 5, // Round the corners
  },
  buttonText: {
    color: "#ffffff", // Text color that contrasts with the button color
    fontWeight: "bold", // Make text bold
  },
  navText: {
    color: "#6200EE", // This can be your theme color
    fontSize: 16, // Slightly larger font size
    fontWeight: "bold", // Optional: if you want this text to stand out more
    marginTop: 15, // Space between the login button and this text
  },
});
