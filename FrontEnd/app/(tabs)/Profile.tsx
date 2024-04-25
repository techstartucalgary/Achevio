import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Pressable,
  ImageBackground,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { AreYouSure } from "../../components/PopUpMessages";
import { setUserId } from "../redux/actions/userActions";
import { Image } from 'expo-image';
import { persistor, resetAndFlushStore } from "../redux/store/store";
import { Icon } from "react-native-elements";

// Dummy fallback data
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
// Simulate API calls
const updateNotificationSettings = async (isEnabled) => {
  // Here you'd replace with your actual API call
  console.log(`API call to update notifications: ${isEnabled}`);
};
const ProfilePage: React.FC = () => {
  const { url, userId, username, theme } = useSelector(
    (state: any) => state.user
  );
  const { me } = useSelector((state: any) => state.user);
  const [profileData, setProfileData] = useState(fallbackData);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userIDAgain, setUserIDAgain] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [avatarUri, setAvatarUri] = useState(
    "https://static.vecteezy.com/system/resources/previews/026/619/142/non_2x/default-avatar-profile-icon-of-social-media-user-photo-image-vector.jpg"
  );
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const handleDarkModeToggle = () => {
    setIsDarkMode((previousState) => !previousState);
    console.log(`Dark mode is now ${isDarkMode ? "enabled" : "disabled"}`);
    dispatch({ type: "SET_THEME", payload: isDarkMode ? "dark" : "light" });
    console.log(`Theme is now ${theme}`);
  };

  const handleNotificationsToggle = async () => {
    try {
      const response = await updateNotificationSettings(!notificationsEnabled);
      setNotificationsEnabled((previousState) => !previousState);
    } catch (error) {
      Alert.alert("Error", "Failed to update notification settings.");
    }
  };

  const fetchData = async () => {
    try {
      // const configurationObject = {
      //   method: "get",
      //   url: `${url}/user/me`,
      //   headers: {
      //     accept: "application/json",
      //     "Content-Type": "application/json",
      //   },
      // };
      // const response = await axios(configurationObject);
      // const data = response.data;
      // console.log("API call success:", data);
      setProfileData((prevState) => ({
        ...prevState,
        username: me.username || prevState.username,
        settings: me.settings || prevState.settings,
        preferences: me.preferences || prevState.preferences,
        More: me.More || prevState.More,
      }));
      setUserId(me.id);
      setUserIDAgain(me.id);
      console.log("user_id:", me.id);

      if (me) {

        console.log(
          `${url}/user/image/${me.id}.jpg?cacheBust=${new Date().getTime()}`
        );
        setAvatarUri(
          `${url}/user/image/${me.id}.jpg?cacheBust=${new Date().getTime()}`
        );
      } else {
        setAvatarUri(
          "https://templates.joomla-monster.com/joomla30/jm-news-portal/components/com_djclassifieds/assets/images/default_profile.png"
        );
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      fetchData(); // This will now also update the avatarUri state
      setAvatarUri(
        `${url}/user/image/${userIDAgain}.jpg?cacheBust=${new Date().getTime()}`
      );
    } catch (error) {
      console.error("Failed to refresh profile data:", error);
    }

    setRefreshing(false);
  }, []);
  const uploadImage = async (uri: string) => {
    const url_extension = `${url}/user/profile_image`;
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "image.jpg",
      type: "image/jpg",
    } as any);

    try {
      const response = await axios.patch(url_extension, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Image uploaded successfully:", response);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const pickImage = async () => {
    console.log("Requesting media library permissions"); // debug
    // Request media library permissions
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // Launch image picker
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (pickerResult.canceled) {
      console.log("Image picker canceled");
      return;
    }
    // Handle the selected image
    // You can set the image uri to state and show a preview or directly upload
    console.log("Image selected:", pickerResult);
    setAvatarUri(pickerResult.assets[0].uri as string);
    uploadImage(pickerResult.assets[0].uri as string);
  };
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={{ alignItems: "center" }}>

        <ImageBackground source={{ uri: avatarUri }}style={styles.headerContainer}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.username}>{username}</Text>
        <TouchableOpacity
          onPressIn={() =>
            AreYouSure(
              pickImage,
              "Are you sure you want to change your profile picture?"
            )
          }
        >
          <Image source={{ uri: avatarUri }} style={styles.avatar} cachePolicy="memory-disk"/>

        </TouchableOpacity>
        <TouchableOpacity style={{ position:"absolute", top: 50, right: 10, zIndex:100 }} onPress={() => router.push("/(Settings)/MainSettingsPage")}>
        <Icon name="settings" size={40} color="white"/>
          </TouchableOpacity>
        </ImageBackground>
      </View>


    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Darker background for the main container
  },
  headerContainer: {
    alignItems: "center",
    height: 220,
    marginBottom: 30,
    width: "100%",

  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff", // White color for better readability
    paddingVertical: 30,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 80,
    marginBottom: 10,
    top: 15,
    borderColor: "white", // Keeping the white border for contrast
    borderWidth: 4,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff", // Changed to white for readability against dark background
  },
  sectionContainerTop: {
    paddingTop: 40,
  },
  sectionContainer: {},
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
    color: "#ffffff", // White for text to ensure it stands out
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#373737", // Darker color for the line to be subtle
  },
  optionText: {
    fontSize: 16,
    color: "#ffffff", // White for readability
  },
  button: {
    backgroundColor: "#373737", // A dark but slightly lighter shade for buttons
    padding: 5,
    borderRadius: 20,
    marginTop: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  edit: {
    position: "relative",
    top: 70,
    width: 50,
    height: 50,
    borderRadius: 50,
    left: 190,
    zIndex: 100,
    backgroundColor: "#242424", // Make sure the edit button also fits the dark theme
  },
});

export default ProfilePage;
