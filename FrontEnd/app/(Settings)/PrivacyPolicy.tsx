import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

const PrivacyPolicy: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.text}>
        Last updated: [Date]
      </Text>
      <Text style={styles.text}>
        [Your Company Name] ("us", "we", or "our") operates [Your App Name] (hereinafter referred to as the "Service").
      </Text>
      <Text style={styles.text}>
        This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data. The Privacy Policy for [Your Company Name] has been created with the help of [source].
      </Text>
      <Text style={styles.heading}>Information Collection and Use</Text>
      <Text style={styles.text}>
        We collect several different types of information for various purposes to provide and improve our Service to you.
      </Text>
      {/* Add more sections as required */}
      <Text style={styles.heading}>Types of Data Collected</Text>
      <Text style={styles.subHeading}>Personal Data</Text>
      <Text style={styles.text}>
        While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
      </Text>
      <Text style={styles.listItem}>• Email address</Text>
      <Text style={styles.listItem}>• First name and last name</Text>
      <Text style={styles.listItem}>• Phone number</Text>
      <Text style={styles.listItem}>• Address, State, Province, ZIP/Postal code, City</Text>
      <Text style={styles.listItem}>• Cookies and Usage Data</Text>
      {/* Continue listing data and other sections as needed */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 22,
  },
});

export default PrivacyPolicy;
