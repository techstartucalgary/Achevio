import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { Alert } from "react-native";
import { router } from "expo-router";

const EditProfile: React.FC = () => {
  const [firstName, setFirstName] = useState(""); // Use local state to store the user's first name
  const [lastName, setLastName] = useState(""); // Use local state to store the user's last name
  const [username, setUsername] = useState(""); // Use local state to store the user's username
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  const url = useSelector((state: any) => state.user.url); // Access URL from Redux state

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${url}/user/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          first_name: firstName,
          last_name: lastName,
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      Alert.alert("Success", "Profile updated successfully");

      // navigate to the profile page
      router.push("/(tabs)/Profile");

      // Handle success response
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TextInput value={username} onChangeText={setUsername} placeholder="Username" style={styles.input} />

      <TextInput value={firstName} onChangeText={setFirstName} placeholder="First name" style={styles.input} />

      <TextInput value={lastName} onChangeText={setLastName} placeholder="Last name" style={styles.input} />

      <TextInput value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" style={styles.input} />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 5,
    paddingLeft: 10,
  },
  textArea: {
    height: 100,
    paddingTop: 10,
  },
  button: {
    backgroundColor: "#4A90E2",
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditProfile;
