import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { Platform } from 'react-native';


interface JoiningCommunityProps {
}

const JoiningCommunity: React.FC<JoiningCommunityProps> = () => {
    const [goalDays, setGoalDays] = useState<number>(1);
    const params = useLocalSearchParams();
    const communityId = params.communityId;
    const { url } = useSelector((state: any) => state.user);

  const joinCommunity = async () => {
    try {
      console.log("Joining Community");
      const res = await axios.put(`${url}/community/join/${communityId}/?goalDays=${goalDays}`);
      console.log(res.data);
      if (res.status === 200) {
        console.log("Community joined successfully:", res.data);
        Alert.alert("Community joined successfully");
        router.push("/(tabs)/Communities");
      }
    } catch (error) {
      console.error("Failed to join community:", error);
      Alert.alert("Failed to join community");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>How many goals do you want to set per week?</Text>
      <Picker
        selectedValue={goalDays}
        onValueChange={(itemValue, itemIndex) => setGoalDays(itemValue)}
        style={styles.picker}
        itemStyle={styles.pickerItem}
      >
        {Array.from({ length: 7 }, (_, i) => (
          <Picker.Item label={`${i + 1}`} value={i + 1} key={i} color='#ffff' /> 

        ))}
      </Picker>
      <TouchableOpacity style={styles.button} onPress={joinCommunity}>
        <Text style={styles.buttonText}>Join Community</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212', // Dark background
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF', // White text color
    marginBottom: 20,
  },
  picker: {
    width: 300,
    height: 50,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#3333333', // White background for iOS, purple for Android
  },
  pickerItem: {
    color: '#FFFFFF', // Ensures picker items are also styled appropriately
  },
  button: {
    marginTop: 150,
    backgroundColor: '#6200EE', // Stylish purple button
    padding: 10,
    borderRadius: 25,
    width: 200,
    alignItems: 'center', // Center text inside the button
    justifyContent: 'center',
    height: 50,
  },
  buttonText: {
    color: '#FFFFFF', // White text color
    fontSize: 16,
  }
});

export default JoiningCommunity;
