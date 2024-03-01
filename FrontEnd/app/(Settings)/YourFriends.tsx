import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons"; // Make sure to install @expo/vector-icons

type Friend = {
  id: string;
  username: string;
  userImage: string; // Added userImage property
};

const YourFriendsPage: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const { url } = useSelector((state: any) => state.user);

  const fetchFriends = useCallback(async () => {
    try {
      const response = await axios.post(`${url}/user/friends`);
      const friendsData = response.data.map((friend: any) => ({
        ...friend,
        userImage: `${url}/user/image/${friend.id}.jpg`, // Construct the image URL
      }));
      setFriends(friendsData);
    } catch (error) {
      console.error("Error fetching friends:", error);
      Alert.alert("Error", "Unable to fetch friends.");
    }
  }, [url]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const removeFriend = async (friendId: string) => {
    try {
      await axios.delete(`${url}/user/friend/${friendId}`);
      Alert.alert("Success", "Friend removed successfully.");
      fetchFriends();
    } catch (error) {
      console.error("Error removing friend:", error);
      Alert.alert("Error", "Unable to remove friend.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Friends</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            router.push({
              pathname: "/(Settings)/AddFriends",
            });
          }}
        >
          <FontAwesome name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}> Add Friends</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Image source={{ uri: item.userImage }} style={styles.userImage} />
            <Text style={styles.username}>{item.username}</Text>
            {/* <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeFriend(item.id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity> */}
          </View>
        )}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 20,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#5C5CFF",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  friendItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  username: {
    color: "#fff",
    fontSize: 18,
  },
  removeButton: {
    backgroundColor: "#FF5C5C",
    padding: 10,
    borderRadius: 20,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default YourFriendsPage;
