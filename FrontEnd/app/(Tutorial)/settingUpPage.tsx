import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Animated,
  Image,
  Easing,
  InteractionManager,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ScreenHeight, ScreenWidth } from "react-native-elements/dist/helpers";
import LottieView from "lottie-react-native";
interface User {
  id: string;
  username: string;
}
const categories = {
  Sports: [
    "Running",
    "Swimming",
    "Cycling",
    "Soccer",
    "Basketball",
    "Golf",
    "Surfing",
    "Skateboarding",
  ],
  Music: ["Guitar", "Piano", "Singing", "Dancing", "Violin"],
  Art: ["Drawing", "Painting", "Sculpting"],
  Lifestyle: [
    "Cooking",
    "Hiking",
    "Reading",
    "Baking",
    "Sewing",
    "Studying",
    "Gardening",
    "Meditation",
    "Yoga",
    "Photography",
  ],
};

interface Tag {
  name: string;
  color: string;
  category?: string;
}
const settingUpPage = () => {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const { url } = useSelector((state: any) => state.user);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const fadeAnim = new Animated.Value(0);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current; // Initial scale value
  const [currentScreen, setCurrentScreen] = useState("YourProfile");
  const [goingBack, setGoingBack] = useState(false);

  const pickImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Permission to access camera roll is required!"
      );
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setAvatarUri(pickerResult.assets[0].uri as string);
      animateImage();
      uploadImage(pickerResult.assets[0].uri as string);
    }
  };

  const uploadImage = async (uri: string) => {
    const url_extension = `${url}/user/profile_image`;
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "image.jpg",
      type: "image/jpg",
    } as any);

    try {
      await axios.patch(url_extension, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Upload Failed", "Failed to upload profile image.");
    }
  };

  const animateImage = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const fetchTags = async () => {
      try {
        const response = await axios.get(`${url}/tag`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        const categorizedTags = response.data.map((tag) => ({
          ...tag,
          category: Object.keys(categories).find((key) =>
            categories[key].includes(tag.name)
          ),
        }));
        setTags(categorizedTags);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to fetch tags");
      }
    };
    fetchTags();
  }, []);

  const handleSelectTag = (selectedTag: Tag) => {
    setSelectedTags((prev) =>
      prev.some((tag) => tag.name === selectedTag.name)
        ? prev.filter((tag) => tag.name !== selectedTag.name)
        : [...prev, selectedTag]
    );
  };

  const renderTagItem = ({ item }) => {
    const isSelected = selectedTags.some((tag) => tag.name === item.name);
    return (
      <TouchableOpacity
        style={[
          styles.tagItem,
          isSelected
            ? { backgroundColor: item.color }
            : styles.tagItemNotSelected,
        ]}
        onPress={() => handleSelectTag(item)}
      >
        <Text
          style={[
            styles.tagText,
            isSelected ? { color: "white" } : { color: "black" },
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCategory = ({ item }) => {
    const categoryTags = tags.filter((tag) => tag.category === item);
    return (
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{item}</Text>
        <FlatList
          data={categoryTags}
          renderItem={renderTagItem}
          keyExtractor={(item) => item.name}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };
  const onButtonPress = (nextPage) => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigateTo(nextPage);
    });
  };
  const fetchMe = async () => {
    try {
      const response = await axios.get(`${url}/user/me`);
      return response.data.id;
    } catch (error) {
      console.error("Error fetching user info:", error);
      Alert.alert("Error", "Unable to fetch your user information.");
      return null;
    }
  };

  const fetchUsersAndFriends = async () => {
    try {
      const userId = await fetchMe();
      const [usersResponse, friendsResponse] = await Promise.all([
        axios.get(`${url}/user`),
        axios.post(`${url}/user/friends`),
      ]);
      const allUsers = usersResponse.data.filter(
        (user: User) => user.id !== userId
      );
      const friendIds: string[] = friendsResponse.data.map(
        (friend: User) => friend.id
      );
      setFriends([...friendIds]);
      setUsers(allUsers.filter((user: User) => !friendIds.includes(user.id)));
      setSearchText("");
    } catch (error) {
      console.error("Error fetching users or friends:", error);
      Alert.alert("Error", "Unable to fetch users or friends.");
    }
  };

  useEffect(() => {
    fetchUsersAndFriends();
  }, []);
  const handleSubmitTags = async (selectedTags: Tag[]) => {
    const body = selectedTags.map(tag => ({
      name: tag.name,
      color: tag.color,
    }));
  
    try {
      await axios.post(`${url}/user/setInterests`, body);
      Alert.alert("Success", "Tags added successfully.");
    } catch (error) {
      console.error("Error adding tags:", error);
      Alert.alert("Error", "Unable to add tags.");
    }
  };
  
  const handleSearch = useCallback(
    (text: string) => {
      setSearchText(text);
      const lowercasedFilter = text.toLowerCase();
      const filteredData = users.filter((item) =>
        item.username.toLowerCase().includes(lowercasedFilter)
      );
      setFilteredUsers(filteredData);
    },
    [users]
  );

  const addFriend = async (friendId: string) => {
    try {
      await axios.post(`${url}/user/friend/${friendId}`);
      Alert.alert("Success", "Friend added successfully.");
      fetchUsersAndFriends(); // Refresh the list to reflect the changes
    } catch (error) {
      console.error("Error adding friend:", error);
      Alert.alert("Error", "Unable to add friend.");
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userContainer}>
      <Text style={styles.username}>{item.username}</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => addFriend(item.id)}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
  // For animations
  const screenAnim = useRef(new Animated.Value(0)).current; // 0: Current screen is visible, 1: Next screen is visible

  // Trigger screen transitions
  useEffect(() => {
    Animated.timing(screenAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentScreen]);

  const navigateTo = (screenName) => {
    // Start with the current screen sliding up
    Animated.timing(screenAnim, {
      toValue: 1, // Slide up
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      InteractionManager.runAfterInteractions(() => {
        setCurrentScreen(screenName);
        screenAnim.setValue(0); // Reset for the next transition
      });
    });
  };

  const navigateBack = (screenName) => {
    // Start with the current screen sliding down
    Animated.timing(screenAnim, {
      toValue: -1, // Slide down
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      InteractionManager.runAfterInteractions(() => {
        setCurrentScreen(screenName);
        screenAnim.setValue(0); // Reset for the next transition
      });
    });
  };

  const screenTransitionStyle = {
    transform: [
      {
        translateY: screenAnim.interpolate({
          inputRange: [-1, 1], // Handle both negative and positive values
          outputRange: [-1000, 1000], // Corresponding movement distance
        }),
      },
    ],
  };

  const renderYourProfile = () => {
    return (
      <LinearGradient
        colors={["#3a1c71", "#d76d77", "#ffaf7b"]}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Set Your Profile Picture</Text>
          <TouchableOpacity
            onPress={pickImage}
            style={styles.avatarPlaceholder}
          >
            {avatarUri ? (
              <Animated.Image
                source={{ uri: avatarUri }}
                style={[styles.avatar, { transform: [{ scale: scaleAnim }] }]}
              />
            ) : (
              <Text style={styles.avatarText}>Tap to select image</Text>
            )}
          </TouchableOpacity>
          {avatarUri ? (
        <TouchableOpacity onPress={() => onButtonPress("pickInterest")}

              style={[
                styles.nextButton,
                { position:"relative", bottom: -270, width: 150 }
              ]}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={pickImage} style={styles.button}>
              <Text style={styles.buttonText}>Upload Image</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    );
  };

  const renderPickInterest = () => {
    return (
      <Animated.View style={[styles.container, fadeAnim ]}>
      <View style={styles.container}>
              <LottieView
            source={require("../../assets/background_space.json")}
            autoPlay
            loop
            style={{
              position: "absolute", // Set position to absolute
              width: ScreenWidth, // Cover the entire width
              height: ScreenHeight, // Cover the entire height
              zIndex:-1, // Ensure it stays behind other components
            }}
          />
        <Text style={styles.title}>Select Your Interests</Text>
        <FlatList
          data={Object.keys(categories)}
          renderItem={renderCategory}
          keyExtractor={(item) => item}
        />
        {/* Navigation buttons container */}
        <View style={styles.navigationButtonsContainer}>
          <TouchableOpacity
            onPress={() => navigateBack("YourProfile")}
            style={styles.backButton}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            handleSubmitTags(selectedTags);
            onButtonPress("AddFriends")
          }} style={styles.nextButton}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
      </Animated.View>
    );
  };

  const renderAddFriends = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Add Friends</Text>
      <Text style={styles.descriptionText}>
        Connect with friends to see what they are up to and share your experiences.
      </Text>
      <TextInput
        style={styles.searchInput}
        onChangeText={handleSearch}
        value={searchText}
        placeholder="Search by name or username"
        placeholderTextColor="#666"
      />
      <FlatList
        data={searchText ? filteredUsers : users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        style={styles.usersList}
      />
      <View style={styles.navigationButtonsContainer}>
        <TouchableOpacity
          onPress={() => navigateBack("pickInterest")}
          style={styles.backButton}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(tabs)/Camera")

        } style={styles.nextButton}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
    
    );
  };

  return (
    <Animated.View style={[styles.container, screenTransitionStyle]}>
      {currentScreen === "YourProfile" && renderYourProfile()}
      {currentScreen === "pickInterest" && renderPickInterest()}
      {currentScreen === "AddFriends" && renderAddFriends()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: ScreenWidth,
    height: ScreenHeight,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  screenContainer: {
    width: "100%",
    alignItems: "center",
    padding: 20,
  },
  usersList: {
    width: "100%",
    color: "white",
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  navigationButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
  },
  backButton: {
    backgroundColor: "#ff6347",
    padding: 15,
    borderRadius: 25,
    marginEnd: 10,
    width: ScreenWidth / 2 - 80, // Half the screen width minus some padding
  },
  nextButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 25,
    width: ScreenWidth / 2 - 80, // Half the screen width minus some padding
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  avatarPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#ffffff30",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  avatarText: {
    color: "white",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#ff6347",
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  tagItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#ddd",
    borderRadius: 10,
    marginRight: 10,
  },
  tagText: {
    fontSize: 16,
    color: "#000",
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  username: {
    fontSize: 16,
    color: "white",
  },
  addButton: {
    backgroundColor: "#1e90ff",
    padding: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  searchInput: {
    width: "100%",
    height: 40,
    color: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  tagItemNotSelected: {
    backgroundColor: "#d3d3d3",
  },
  categoryContainer: {
    marginBottom: 30,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#DDD",
    marginBottom: 15,
    paddingLeft: 10,
  },
  // Additional styles for AddFriends and PickInterest
});

export default settingUpPage;
