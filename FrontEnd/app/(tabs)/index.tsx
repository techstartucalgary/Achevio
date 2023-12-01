import React, { useState } from "react";
import {
  StatusBar,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { Link } from "expo-router";
import GoogleLoginButton from "../../components/googleLoginButton";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Signup: undefined;
  Login: undefined;
  modal: undefined;
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
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            /* handle login */
          }}
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
});
