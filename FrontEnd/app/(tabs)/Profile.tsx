import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import { setUsername,setUrl } from "../redux/actions";

// Dummy fallback data
const fallbackData = {
  username: 'John Doe',
  avatarUri: 'https://i.pravatar.cc/150?img=68',
  settings: [
    { title: 'Edit profile', icon: 'chevron-right', navigateTo: 'EditProfile' },
    { title: 'Change password', icon: 'chevron-right', navigateTo: 'ChangePassword' },
    { title: 'Dark mode', icon: null, isSwitch: true, navigateTo: 'DarkMode'},
    { title: 'Push notifications', icon: null, isSwitch: true },
  ],
  preferences: [
    { title: 'Security and privacy', icon: 'chevron-right',navigateTo: 'SecurityAndPrivacy' },
    { title: 'Invite friends', icon: 'chevron-right',navigateTo: 'InviteFriends' },
    { title: 'Add a payment method', icon: 'chevron-right',navigateTo: 'AddPaymentMethod' },
  ],
  More : [
    { title: 'About us', icon: 'chevron-right',navigateTo: 'AboutUs' },
    { title: 'Privacy policy', icon: 'chevron-right',navigateTo: 'PrivacyPolicy' },
  ],
};
// Simulate API calls
const updateNotificationSettings = async (isEnabled) => {
  // Here you'd replace with your actual API call
  console.log(`API call to update notifications: ${isEnabled}`);
  // Simulate API response delay
  return new Promise(resolve => setTimeout(() => resolve(isEnabled), 500));
};
const ProfilePage: React.FC = () => {
  const { url, userId, username} = useSelector((state: any) => state.user);
  const [profileData, setProfileData] = useState(fallbackData);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [avatarUri] = useState(`${url}/user/image/${userId}.jpg`);
  const handleDarkModeToggle = () => {
    setIsDarkMode(previousState => !previousState);
    console.log(`Dark mode is now ${isDarkMode ? 'enabled' : 'disabled'}`);
  };
  const handleNotificationsToggle = async () => {
    try {
      const response = await updateNotificationSettings(!notificationsEnabled);
      setNotificationsEnabled(response as boolean);
    } catch (error) {
      Alert.alert('Error', 'Failed to update notification settings.');
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try{
        const configurationObject = {
          method: 'get',
          url : `${url}/user/me`,
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },

      }
      const response = await axios(configurationObject);
      const data = response.data;

        // Update state with fetched data, or keep dummy data if the API returns incomplete data
        setProfileData(prevState => ({
          ...prevState,
          username: data.username || prevState.username,
          avatarUri: data.avatarUri || prevState.avatarUri,
          settings: data.settings || prevState.settings,
          preferences: data.preferences || prevState.preferences,
          More: data.More || prevState.More,
        }));
      } catch (error) {
        console.error('API call failed:', error);
        // If the API call fails, fallbackData will already be in place
      }
    };

    fetchData();
  }, []);

  return (
<ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.username}>{username}</Text>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
      </View>

      <View style={styles.sectionContainerTop}>
        <Text style={styles.sectionTitle}>Account settings</Text>
        {profileData.settings?.map((setting, index) => (
          <TouchableOpacity key={index} style={styles.option} onPress={
            () => router.push(`/(Settings)/${setting.navigateTo}` as any)
          }>
            <Text style={styles.optionText}>{setting.title}</Text>
            <MaterialIcons name={setting.icon } size={24} color="black" />
          </TouchableOpacity>
        ))}
        <View style={styles.option}>
          <Text style={styles.optionText}>Dark mode</Text>
          <Switch value={isDarkMode} onValueChange={handleDarkModeToggle} />
        </View>
        <View style={styles.option}>
          <Text style={styles.optionText}>Push notifications</Text>
          <Switch value={notificationsEnabled} onValueChange={handleNotificationsToggle} />
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        {profileData.preferences?.map((preference, index) => (
          <TouchableOpacity key={index} style={styles.option} onPress={
            () => router.push(`/(Settings)/${preference.navigateTo}` as any)
          }>
            <Text style={styles.optionText}>{preference.title}</Text>
            
            <MaterialIcons name={preference.icon as any} size={24} color="black" />
          </TouchableOpacity>
        ))}
      </View>
      <View style = {styles.sectionContainer}>
      <Text style={styles.sectionTitle}>More</Text>
      {profileData.More?.map((More, index) => (
          <TouchableOpacity key={index} style={styles.option} onPress={
            () => router.push(`/(Settings)/${More.navigateTo}` as any)
          }>
          <Text style={styles.optionText}>{More.title}</Text>
          <MaterialIcons name={More.icon as any } size={24} color="black" />
          </TouchableOpacity>
        ))}
      </View>
      <View style = {styles.sectionContainer}>
        <TouchableOpacity style={styles.option} onPress={() => router.push('/(Login)/home')}>
          <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: '#ADD8E6',
    height: 220,
    paddingTop: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'black',
    paddingVertical: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 80,
    marginBottom: 10,
    top: 15,
    borderColor: 'white',
    borderWidth: 4,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  sectionContainerTop: {
    paddingTop: 70,
  },
  sectionContainer: {
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  optionText: {
    fontSize: 16,
  },
});

export default ProfilePage;
