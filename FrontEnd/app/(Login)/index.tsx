import React, {useState} from "react";
import {
  Keyboard,
  Pressable,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { Link, router} from "expo-router";
import GoogleLoginButton from "../../components/googleLoginButton";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";


type RootStackParamList = {
  Signup: undefined;
  Login: undefined;
  modal: undefined;
  Camera: undefined;
};

type SignupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Signup"
>;

type Props = {
  navigation: SignupScreenNavigationProp;
};
export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
  const [errorMessageVisible, setErrorMessageVisible] = useState(false)
  
type LoginResponse = {
  status: number
  data: LoginData,
}

type LoginData = {
  access_token: string,
  token_type: string,
  refresh_token: string
  expires_in: number,
  detail: string
  }


  async function postLoginInfo(): Promise<LoginResponse> {
    try {
      const configurationObject = {
        method: 'post',
        // URl should be replaced with some route
        url: `http://10.0.0.217:8000/login`,
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        data: {
          username: username,
          password: password
        }
      };
      return await axios(configurationObject)
    } catch (error: any) {
      console.error(error);
      console.log(error.response.status, error.response.data.detail)
      return error.response
    }
  }
  function responseCheck(response: LoginResponse): boolean {
    let checkResult: boolean = true
    if (response.status !== 201 ) {
      checkResult = false
      setErrorMessageVisible(true)
      setErrorMessage(response.data.detail)
    }
    return checkResult;
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  function onPressLoginButton(): void {
    router.push('/(tabs)/Camera')
  }

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
        {
          errorMessageVisible ?
            <Text style={styles.errorStyle}>
              {errorMessage}
            </Text>
            : null
        }
        <TouchableOpacity
          style={styles.button}
          // onPress={async () => {
          //   /* handle signup */
          //   const res = await postLoginInfo()
          //   if (responseCheck(res)) {
          //     //navigate to main page
          //     console.log("success login")
          //     setErrorMessageVisible(false)
          //   }
          // }}
          onPress={() => 
            onPressLoginButton()
         
          }
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <GoogleLoginButton />
        )}
        <Link href="/two" asChild>
          <Pressable>
            <Text style={styles.navText}>Go to Signup</Text>
          </Pressable>
        </Link>

        <StatusBar backgroundColor="#000000" barStyle="light-content"/>
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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 5,
    color: "#333",
  },
  button: {
    width: "100%",
    backgroundColor: "#6200EE",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  navText: {
    color: "#6200EE",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
  errorStyle:{
    fontSize: 14,
    color: "#ee0008",
    fontWeight: "500",
    marginBottom: 6,
    marginTop: -4,
  }
});
