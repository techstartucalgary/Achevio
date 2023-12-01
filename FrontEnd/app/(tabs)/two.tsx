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
// web: 936305079160-l5l7ao7l492ik2q5o4oghlhho47ukbr2.apps.googleusercontent.com
// ios : 936305079160-57f2gdoajsr86j74rf4a7012cl6r0e4n.apps.googleusercontent.com
// android : 936305079160-ab83cfppiao2407gcqslm6grmqumkui0.apps.googleusercontent.com
export default function SignupScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      <TouchableOpacity
        style={styles.signupBtn}
        onPress={() => {
          /* handle signup */
        }}
      >
        <Text style={styles.signupText}>Signup</Text>
      </TouchableOpacity>

      <Link href="/" style={styles.linkstyle}>
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
  linkstyle: {
    marginTop: 20,
  },
});
