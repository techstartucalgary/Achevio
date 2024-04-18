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
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { router } from "expo-router";

export default function SignupScreen() {
  const [localUsername, setLocalUsername] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [isLoading] = useState(false);

  const validateInput = () => {
    if (first_name === "" || last_name === "" || localUsername === "") {
      Alert.alert("Error", "Please fill in all fields.");
      return false;
    }

    return true;
  };
  const goNext = () => {
    router.replace({
      pathname: "/(Login)/home",
      params: {
        username: localUsername,
        first_name: first_name,
        last_name: last_name,
        slider: 3,
      },
    });
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
            <Image
              source={require("../../assets/images/temp_rocket.png")}
              style={styles.image}
            />
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
            <TouchableOpacity
              style={styles.signupBtn}
              onPress={() => {
                if (validateInput()) {
                  goNext();
                }
              }}
              disabled={isLoading}
            >
              <Text style={styles.signupText}>Continue</Text>
            </TouchableOpacity>
            <Text style={styles.navText}>
              ---------------- OR ----------------
            </Text>
            <TouchableOpacity
              style={styles.linkstyle}
              onPress={() =>
                router.replace({
                  pathname: "/(Login)/home",
                  params: {
                    slider: 1,
                  },
                })
              }
            >
              <Text style={styles.loginText}>Go back to Login</Text>
            </TouchableOpacity>

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
  keyboardView: {
    flex: 1,
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
