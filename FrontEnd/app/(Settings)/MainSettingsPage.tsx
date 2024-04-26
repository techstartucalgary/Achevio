import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { persistor, resetAndFlushStore } from "../redux/store/store";

const AccountSettingsPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const dispatch = useDispatch();

  const handleDarkModeToggle = () => setIsDarkMode(previousState => !previousState);
  const handleNotificationsToggle = () => setNotificationsEnabled(previousState => !previousState);

  // Placeholder for profileData if it's not provided from props
  const fallbackData = {
    username: "John Doe",
    avatarUri: "https://i.pravatar.cc/150?img=68",
    settings: [
      { title: "Edit profile", icon: "chevron-right", navigateTo: "EditProfile" },
      {
        title: "Change password",
        icon: "chevron-right",
        navigateTo: "ChangePassword",
      },
    ],
    preferences: [
      {
        title: "Security and privacy",
        icon: "chevron-right",
        navigateTo: "SecurityAndPrivacy",
      },
      {
        title: "Your Friends", // New option
        icon: "person-add", // Material icon for adding a person
        navigateTo: "YourFriends", // Assuming you have a route set up for this
      },
      {
        title: "Invite friends",
        icon: "chevron-right",
        navigateTo: "InviteFriends",
      },
      {
        title: "Add a payment method",
        icon: "chevron-right",
        navigateTo: "AddPaymentMethod",
      },
    ],
    More: [
      { title: "About us", icon: "chevron-right", navigateTo: "AboutUs" },
      {
        title: "Privacy policy",
        icon: "chevron-right",
        navigateTo: "PrivacyPolicy",
      },
    ],
  };

  // Use profileData from props if available, otherwise use fallbackData
  const data = fallbackData;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sectionContainerTop}>
      <Text style={styles.sectionTitle}>Account settings</Text>
        {data.settings?.map((setting, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() =>
              router.push(`/(Settings)/${setting.navigateTo}` as any)
            }
          >
            <Text style={styles.optionText}>{setting.title}</Text>
            <MaterialIcons name={setting.icon as any} size={24} color="black" />
          </TouchableOpacity>
        ))}
        <View style={styles.option}>
          <Text style={styles.optionText}>Dark mode</Text>
          <Switch value={isDarkMode} onValueChange={handleDarkModeToggle} />
        </View>
        <View style={styles.option}>
          <Text style={styles.optionText}>Push notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationsToggle}
          />
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        {data.preferences?.map((preference, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() =>
              router.push(`/(Settings)/${preference.navigateTo}` as any)
            }
          >
            <Text style={styles.optionText}>{preference.title}</Text>

            <MaterialIcons
              name={preference.icon as any}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>More</Text>
        {data.More?.map((More, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => router.push(`/(Settings)/${More.navigateTo}` as any)}
          >
            <Text style={styles.optionText}>{More.title}</Text>
            <MaterialIcons name={More.icon as any} size={24} color="black" />
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.sectionContainer}>
        <TouchableOpacity
          style={styles.option}
          onPress={async() => {
            resetAndFlushStore();
            dispatch({ type: "UPDATE_USERNAME", userName: "" });
            dispatch({ type: "UPDATE_PASSWORD", passWord: "" });
            router.push("/(Login)/home");
          }
          }
        >
          <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282c34', // Dark theme background color
    paddingTop: 50,
  },
  sectionContainerTop: {
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    padding: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#404040', // Border color for each option
  },
  optionText: {
    color: '#FFF', // White color for text to stand out on the dark background
    fontSize: 16,
  },
  sectionContainer: {
    // Same styles as sectionContainerTop...
  },
  // Add any additional styles you may need
});

export default AccountSettingsPage;
