import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const EditProfile: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  const handleSubmit = () => {
    // Handle the submit action here. For example, update the user profile.
    console.log("Profile Updated:", { name, email, bio });
    // After updating, you might want to navigate back or show a success message
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        value={bio}
        onChangeText={setBio}
        placeholder="Bio"
        multiline
        numberOfLines={4}
        style={[styles.input, styles.textArea]}
      />

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
