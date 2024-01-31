import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const SecurityAndPrivacy: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Security and Privacy</Text>

      <View style={styles.section}>
        <Text style={styles.heading}>Data Protection</Text>
        <Text style={styles.content}>
          We use industry-standard encryption to protect your data at all times. Your information is
          stored securely on our servers and is only accessible to authorized personnel.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Privacy Policy</Text>
        <Text style={styles.content}>
          Our privacy policy outlines how we collect, use, and protect your information. We are committed
          to ensuring that your privacy is protected and respected.
        </Text>
        {/* You can add a TouchableOpacity here if you want to provide a link to your full privacy policy */}
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.link}>Read our full privacy policy</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Account Security</Text>
        <Text style={styles.content}>
          Your account security is our top priority. We recommend using a strong, unique password and enabling
          two-factor authentication (2FA) for added security.
        </Text>
      </View>

      {/* Add more sections as needed */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  link: {
    marginTop: 10,
    fontSize: 16,
    color: '#4A90E2',
    textDecorationLine: 'underline',
  },
});

export default SecurityAndPrivacy;
