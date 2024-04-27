// SelectCommunities.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";

interface Community {
  community_id: string;
  name: string;
}

const SelectCommunities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useLocalSearchParams();
  const photoUri = params.photoUri;
  const caption = params.caption;
  const title = params.title;
  const location = params.location;
  const { url, username } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const res = axios
      .get(`${url}/user/myCommunities`)
      .then((response) => {
        setCommunities(response.data);
      })
      .catch((error) => console.error("Error fetching communities:", error));
  }, []);

  const handleSelectCommunity = (id: string) => {
    setSelectedCommunities((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("file", {
      uri: photoUri,
      name: "image.jpg",
      type: "image/jpg",
    } as any);
    formData.append("title", title as string);
    formData.append("caption", caption as string);
    // formData.append("longitude", (location as any).coords.longitude.toString());
    // formData.append("latitude", (location as any).coords.latitude.toString());
    formData.append("communities_id", selectedCommunities.join(","));
    console.log("Form data:", formData);
    axios
      .post(`${url}/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        router.push("/(tabs)/Communities");
      })
      .catch((error) => console.error("Error uploading image:", error))
      .finally(() => setIsSubmitting(false));
  };

  const renderItem = ({ item }: { item: Community }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleSelectCommunity(item.community_id)}
    >
      <Image
        source={{ uri: `${url}/community/image/${item.community_id}.jpg` }}
        style={styles.backgroundImage}
        cachePolicy="memory"

        >
        <View style={styles.itemContent}>
          <Text style={styles.text}>{item.name}</Text>
          {selectedCommunities.includes(item.community_id) && (
            <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
          )}
        </View>
      </Image>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <View style={styles.ListofItems}>
        <FlatList
          data={communities}
          renderItem={renderItem}
          keyExtractor={(item) => item.community_id}
        />
      </View>
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isSubmitting}
        style={styles.submitButton}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Submit Post</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background color
  },
  ListofItems: {
    flex: 1,
    marginTop: 60,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12, // Rounded corners for items
    height: 80,
    overflow: "hidden", // Ensure the background image respects the border radius
    backgroundColor: "#1E1E1E", // Darker item background for contrast
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center", // Align content in the center
  },
  communityBackground: {
    borderRadius: 12, // Ensure the image itself also has rounded corners
  },
  itemContent: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Darker semi-transparent overlay for text readability
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20, // Circular avatars
    marginRight: 16,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF", // Light text for better readability against dark theme
  },
  submitButton: {
    backgroundColor: "#5C5CFF", // Vibrant button color
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25, // More pronounced rounded corners for the button
    margin: 20,
    alignItems: "center",
    shadowColor: "#007BFF", // Matching shadow color for consistency
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8, // Elevated button effect
  },
  submitText: {
    fontSize: 18,
    color: "#fff", // White text for contrast
    fontWeight: "bold", // Bold text for the button
  },
});
export default SelectCommunities;
