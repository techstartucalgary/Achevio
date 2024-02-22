import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const AboutUs: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>About Us</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.contentText}>
          Welcome to our company! We are dedicated to delivering outstanding
          products and services to our customers. Our team consists of
          passionate professionals committed to innovation and excellence.
        </Text>
        <Text style={styles.contentText}>
          Founded in [Year], our mission has been to make a positive impact
          through our work. We believe in the power of technology to transform
          lives and are constantly exploring new ways to improve and expand our
          offerings.
        </Text>
        <Text style={styles.contentText}>
          Thank you for choosing us. We look forward to serving you and
          exceeding your expectations.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#4A90E2",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    padding: 20,
  },
  contentText: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
    color: "#333",
  },
});

export default AboutUs;
