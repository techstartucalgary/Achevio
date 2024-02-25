import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const AddPaymentMethod: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Payment Method</Text>

      <TextInput
        placeholder="Card Number"
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Expiration Date (MM/YY)"
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="CVV"
        keyboardType="numeric"
        secureTextEntry
        style={styles.input}
      />

      <TextInput placeholder="Cardholder Name" style={styles.input} />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Add Card</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  },
  input: {
    width: "100%",
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#4A90E2",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddPaymentMethod;
