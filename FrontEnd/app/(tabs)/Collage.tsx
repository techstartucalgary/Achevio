import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import axios from "axios";
import { useSelector } from "react-redux";
import { Image } from "expo-image";

const Collage = () => {
  const [postsData, setPostsData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { url } = useSelector((state: any) => state.user);

  const fetchPostsForCommunity = async (communityId) => {
    try {
      const response = await axios.get(`${url}/posts/community/${communityId}`);
      if (response.status === 200) {
        return response.data.map((post) => ({
          id: post.id,
          uri: `${url}/post/image/${post.id}.jpg`,
          date: new Date(post.created_at).toISOString(), // Assuming 'created_at' is a valid date
        }));
      } else {
        console.error("Failed to fetch posts for community:", communityId);
        return [];
      }
    } catch (error) {
      console.error("Error fetching posts for community:", communityId, error);
      return [];
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchPosts = async () => {
        try {
          const communitiesResponse = await axios.get(
            `${url}/user/myCommunities`
          );
          if (communitiesResponse.status === 200) {
            const communities = communitiesResponse.data;
            const postsPromises = communities.map((community) =>
              fetchPostsForCommunity(community.id)
            );
            const postsArrays = await Promise.all(postsPromises);
            const aggregatedPosts = [].concat(...postsArrays); // Flatten the array of arrays
            setPostsData(aggregatedPosts);
          } else {
            console.error("Failed to fetch communities");
          }
        } catch (error) {
          console.error("Error fetching communities or posts:", error);
        }
      };

      fetchPosts();
    }, [])
  );

  const groupImagesByDate = (images) => {
    const grouped = images.reduce((groups, image) => {
      const date = image.date.split("T")[0]; // Ensure date format is consistent
      (groups[date] = groups[date] || []).push(image);
      return groups;
    }, {});

    return Object.keys(grouped).map((date) => ({
      title: date,
      data: grouped[date],
    }));
  };

  const handleImagePress = (uri) => {
    setSelectedImage(uri);
    setIsModalVisible(true);
  };

  const renderSection = ({ section }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
      <FlatList
        data={section.data}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.imageWrapper}
            onPress={() => handleImagePress(item.uri)}
          >
            <Image source={{ uri: item.uri }} style={styles.image} />
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {groupImagesByDate(postsData).map((section, index) => (
          <View key={index}>{renderSection({ section })}</View>
        ))}
      </ScrollView>
      {selectedImage && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Image source={{ uri: selectedImage }} style={styles.fullImage} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const numColumns = 3;
const size = Dimensions.get("window").width / numColumns;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Consider a background color that complements your images
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeaderText: {
    fontWeight: "600", // Modern, bold typography
    fontSize: 18,
    marginLeft: 10,
    color: "#fff", // Dark color for contrast and readability
  },

  horizontalListContent: {
    paddingLeft: 10,
  },
  imageWrapper: {
    borderRadius: 12, // Rounded corners for a modern look
    overflow: "hidden", // Ensures the Image respects the borderRadius
    marginRight: 10,
  },
  image: {
    width: size,
    height: size,
    resizeMode: "cover", // Ensures the images cover the area without stretching
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Semi-transparent background
  },
  fullImage: {
    width: "90%", // Adjust as needed
    height: "80%", // Adjust as needed
    resizeMode: "contain", // Ensure the image fits within the modal without stretching
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#FFF", // A contrasting color for the button
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: "#000", // Text color that contrasts with the button background
    fontSize: 16,
  },
});

export default Collage;
