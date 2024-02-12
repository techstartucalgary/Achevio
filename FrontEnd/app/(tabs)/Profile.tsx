import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { AreYouSure } from "../../components/PopUpMessages";
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
  const [profileData, setProfileData] = useState(fallbackData);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [avatarUri, setAvatarUri] = useState(
    "https://i.pravatar.cc/150?img=68"
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
      const configurationObject = {
        method: "get",
        url: `${url}/user/me`,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      const response = await axios(configurationObject);
      const data = response.data;
      console.log("API call success:", data);
      setProfileData((prevState) => ({
        ...prevState,
        username: data.username || prevState.username,
        settings: data.settings || prevState.settings,
        preferences: data.preferences || prevState.preferences,
        More: data.More || prevState.More,
      }));
      dispatch({ type: "SET_USERNAME", payload: response.data.username });
      dispatch({ type: "SET_USERID", payload: response.data.id });
      console.log("UserID:", response.data.id);
      console.log("user_id:", userId);
      if (response.data.id) {
        setAvatarUri(
          `${url}/user/image/${response.data.id}.jpg?cacheBust=${new Date().getTime()}`
        );
        console.log(
          `${url}/user/image/${userId}.jpg?cacheBust=${new Date().getTime()}`
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
      await fetchData(); // This will now also update the avatarUri state
      setAvatarUri(
        `${url}/user/image/${userId}.jpg?cacheBust=${new Date().getTime()}`
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
    >
      <View style={styles.headerContainer}>
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
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainerTop}>
        <Text style={styles.sectionTitle}>Account settings</Text>
        {profileData.settings?.map((setting, index) => (
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
        {profileData.preferences?.map((preference, index) => (
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
        {profileData.More?.map((More, index) => (
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
          onPress={() => router.push("/(Login)/home")}
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
    backgroundColor: "#fff",
  },
  headerContainer: {
    alignItems: "center",
    backgroundColor: "#ADD8E6",
    height: 220,
    padding: 30,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "black",
    paddingVertical: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 80,
    marginBottom: 10,
    top: 15,
    borderColor: "white",
    borderWidth: 4,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
  },
  sectionContainerTop: {
    paddingTop: 40,
  },
  sectionContainer: {},
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  optionText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "black",
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
  },
});

export default ProfilePage;
