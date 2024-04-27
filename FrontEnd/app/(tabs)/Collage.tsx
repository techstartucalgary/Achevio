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
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import axios from "axios";
import { useSelector } from "react-redux";
import { Image } from "expo-image";
import { ScreenHeight, ScreenWidth } from "react-native-elements/dist/helpers";
import LottieView from "lottie-react-native";

const Collage = () => {
  const [postsData, setPostsData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const { url } = useSelector((state: any) => state.user);
  const fadeAnim = new Animated.Value(0);  // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true
    }).start();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchPosts = async () => {
        console.log("Fetching posts for user:", userId);
        const response = await axios.get(`${url}/posts/myPosts`);
        if (response.status === 200) {
          console.log("Posts fetched successfully:", response.data);
          setPostsData(groupImagesByDate(response.data));
        } else {
          console.error("Failed to fetch posts for user:", userId);
        }
      }
      fetchPosts();
    }, [userId]) // Include userId in dependencies to refetch posts when it changes
  );

  const groupImagesByDate = (images) => {
    // Extract unique dates
    const uniqueDates = Array.from(new Set(images.map((image) => image.date.split("T")[0])));
  
    // Sort the unique dates in ascending order
    uniqueDates.sort();
  
    // Create groups based on sorted dates
    const grouped = uniqueDates.map((date) => ({
      title: date,
      data: images.filter((image) => image.date.split("T")[0] === date),
    }));
  
    return grouped;
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
            onPress={() => handleImagePress(`${url}/post/image/${item.id}.jpg`)}
          >
            <Image source={{ uri: `${url}/post/image/${item.id}.jpg` }} style={styles.image} />
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
      <LottieView
          source={require("../../assets/background_space.json")}
          autoPlay
          loop
          style={{
            position: 'absolute', // Set position to absolute
            width: ScreenWidth,    // Cover the entire width
            height: ScreenHeight,  // Cover the entire height
            zIndex: -1,            // Ensure it stays behind other components
          }}
        />
    {postsData.length>0 ? (
      console.log("Posts data:", postsData),
      <ScrollView>
      {postsData.map((section, index) => (
        <View key={index}>{renderSection({ section })}</View>
      ))}
    </ScrollView>
      
    ) : (
      console.log("Posts data:", postsData),
      <Animated.View style={[styles.noPostsContainer, { opacity: fadeAnim }]}>
        <Text style={styles.noPostsText}>It looks empty here</Text>
        <Text style={styles.noPostsText}>Why dont you create posts!</Text>
      </Animated.View>
      
    )}
    {selectedImage && (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Image source={{ uri: selectedImage }} style={styles.fullImage} cachePolicy="memory"/>
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
  noPostsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPostsText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    opacity: 0.8,
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
