import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Pressable,
} from "react-native";
import { getDayOfYear, getISODay, set } from "date-fns";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import uuid from "react-native-uuid";
import { useSelector, useDispatch } from "react-redux";
import { ref } from "yup";
import { Image } from 'expo-image';

const ReactionMenu = ( { showReactionMenu, setShowReactionMenu }) => {
  const handleReactionPress = (reaction) => {
    // Handle reaction press here
    console.log("Reaction pressed:", reaction);
    setShowReactionMenu(false);
    
  };
  return (
    <View style={styles.reactionMenu}>
      {/* Wrap each reaction icon inside a Pressable component */}
      <Pressable onPress={() => handleReactionPress("👍")}>
        <Text style={styles.reactionIcon}>👍</Text>
      </Pressable>
      <Pressable onPress={() => handleReactionPress("❤️")}>
        <Text style={styles.reactionIcon}>❤️</Text>
      </Pressable>
      <Pressable onPress={() => handleReactionPress("😂")}>
        <Text style={styles.reactionIcon}>😂</Text>
      </Pressable>
      <Pressable onPress={() => handleReactionPress("😮")}>
        <Text style={styles.reactionIcon}>😮</Text>
      </Pressable>
      <Pressable onPress={() => handleReactionPress("😢")}>
        <Text style={styles.reactionIcon}>😢</Text>
      </Pressable>
      <Pressable onPress={() => handleReactionPress("😡")}>
        <Text style={styles.reactionIcon}>😡</Text>
      </Pressable>
    </View>
  );
};

// Constants
const windowWidth = Dimensions.get("window").width;
const DATE_ITEM_WIDTH = windowWidth / 6; // Display 5 items at a time

// Generate dates data with dynamic range
const generateDatesData = () => {
  // Get the current day of the year
  const today = new Date();
  const currentDayOfYear = getDayOfYear(today);
  const daysInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + i - 3
    );
    return {
      key: String(currentDayOfYear + i - 3),
      day: daysInWeek[date.getDay()],
      date: date.getDate(),
      isToday: i === 3, // If the index is 3, it is the current day
    };
  });
};
const CommentModal = ({ isVisible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Comments will go here...</Text>
          <TouchableOpacity
            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
            onPress={onClose}
          >
            <Text style={styles.textStyle}>Hide Comments</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const datesData = generateDatesData();
const todayIndex = datesData.findIndex((item) => item.isToday);

// Post Details Modal Component
const PostDetailsModal = ({ post, isVisible, onClose, onComment }) => {
  const [showReactionMenu, setShowReactionMenu] = useState(false);

  const handleLikePress = () => {
    // Handle like press
  };
  const handleLongPress = () => {
    setShowReactionMenu(!showReactionMenu);
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Image source={{ uri: post.userImage }} style={styles.userImage} />
            <Text style={styles.postUser}>{post.user}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          <Pressable onLongPress={handleLongPress}>

          <Image
            source={{ uri: post.imageUri }}
            style={styles.modalPostImage}
            cachePolicy="memory-disk"
          >
          </Image>
          {showReactionMenu && <ReactionMenu showReactionMenu={showReactionMenu} setShowReactionMenu={setShowReactionMenu} />}
          </Pressable>
          <Text style={styles.postCaption}>{post.caption}</Text>
        </View>
      </View>
    </Modal>
  );
};
// const postData = Array.from({ length: 10 }, (_, index) => ({
//   key: String(index),
//   imageUri:
//     "https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais",
//   userImage:
//     "https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png",
//   user: "User " + (index + 1),
//   caption: "Caption for post " + (index + 1),
//   comments: [{ id: uuid.v4(), text: "Comment 1 for post " + (index + 1) }],
// }));

type Post = {
  key: string;
  imageUri: string;
  userImage: string;
  user: string;
  caption: string;
  comments: { id: string; text: string }[];
};

const Communities = () => {
  const flatListRef = useRef(null);
  const [postData, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { url } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const fetchCommunities = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/user/myCommunities`);
      dispatch({ type: "SET_USERID", payload: response.data.id });

      if (response.status === 200) {
        setCommunities(response.data);
        dispatch({ type: "SET_MY_COMMUNITIES", payload: response.data });
      } else {
        console.error("Failed to fetch communities:", response.status);
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
    } finally {
      setIsLoading(false);
    }
  }
  , [url]);
  const fetchPosts = useCallback(async () => {
    try {
      // Fetch posts from your API
      const res = await axios.get(`${url}/posts/friends`);
      console.log("Posts:", res.data); // Adjust according to your API response
  
      const postsWithAdditionalDetails = await Promise.all(res.data.map(async (post) => {
        try {
          // Fetch username
          const usernameResponse = await axios.get(`${url}/user/GetNameByID/${post.user_id}`);
          const username = usernameResponse.data.name; // Adjust according to your API response
  
          // Construct post object with additional details
          return {
            key: post.id,
            imageUri: `${url}/post/image/${post.id}.jpg`, // Assuming this is how you get the post image
            userImage: `${url}/user/image/${post.user_id}.jpg`, // Assuming this is how you get the user image
            user: username,
            caption: post.caption,
            comments: [] // Assuming you'll fill this later or adjust according to your needs
          };
        } catch (error) {
          console.error("Error fetching additional post details:", error);
          // Optionally handle the error, e.g., by setting default values
          return {
            key: post.id,
            imageUri: '', // Default or error image URI
            userImage: '', // Default or error user image URI
            user: 'Unknown', // Default username
            caption: post.caption,
            comments: [] // Assuming you'll fill this later or adjust according to your needs
          };
        }
      }));
  
      // Update the state with the new posts
      setPosts(postsWithAdditionalDetails);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }
  , [communities]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await fetchCommunities();
        await fetchPosts();
      };
  
      fetchData();
    }, []) 
  );
  


  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchCommunities();
    } catch (error) {
      console.error("Failed to refresh profile data:", error);
    }
    setRefreshing(false);
  }, []);
  // Function to handle post item press
  const handlePostPress = (post) => {
    setSelectedPost(post);
    setModalVisible(true);
  };

  // Component for rendering post items
  const renderPostItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePostPress(item)}>
      <Image source={{ uri: item.imageUri }} style={styles.postImage} />
    </TouchableOpacity>
  );

  useEffect(() => {
    // Check if today's index is valid and scroll to it
    if (flatListRef.current && todayIndex !== -1) {
      // Calculate the offset to center the item
      const offset =
        todayIndex * DATE_ITEM_WIDTH - windowWidth / 2 + DATE_ITEM_WIDTH / 2;
      flatListRef.current.scrollToOffset({ offset, animated: true });
    }
  }, [todayIndex]);

  const renderDateItem = ({ item, index }) => {
    const isToday = index === todayIndex;
    return (
      <View style={[styles.dateItem, isToday ? styles.highlight : null]}>
        <Text style={styles.dateDay}>{item.day}</Text>
        <Text style={styles.dateNumber}>{item.date}</Text>
      </View>
    );
  };
  // Component for rendering community items
  const renderCommunityItem = ({ item }) => (
    <TouchableOpacity
      style={styles.communityItem}
      onPress={() => {
        router.push({
          pathname: "/(pages)/CommunitiesPage", // The route name
          params: {
            communityId: item.id,
            communityName: item.name,
            communityStreak: item.streak,
            communityTags: item.tags.map((tag) => {
              return tag.name + " " + tag.color;
            }),
            communityImage: `${url}/community/image/${item.id}.jpg`,
          }, // Parameters as an object
        });
      }}
    >
      <ImageBackground
        source={{ uri: `${url}/community/image/${item.id}.jpg` }}
        style={styles.communityItemBackground}
        imageStyle={styles.communityItemImageStyle}
      >
        <Text style={styles.communityTitle}>{item.name}</Text>
        <View style={styles.textOverlay}>
          <Text style={styles.communityStreak}>{item.streak}</Text>
          <View style={{ flexDirection: "row" }}>
          {item.tags.map((tag, index) => (
            <Text style={[styles.communityTags, { backgroundColor: tag.color, borderRadius: 10, padding: 2, marginHorizontal:2 }]}
            key={`${tag.name}_${index}`}>{tag.name + " "}</Text> // Use a combination of name and index
          ))}
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
  const handleCreateCommunity = () => {
    router.push({
      pathname: "/(pages)/CreateCommunities", // The route name
    });
  };
  // Header component to be rendered above the communities list
  const ListHeader = () => (
    <>
      <FlatList
        ref={flatListRef}
        horizontal
        data={datesData}
        renderItem={renderDateItem}
        keyExtractor={(item) => item.communityId}
        showsHorizontalScrollIndicator={false}
        style={styles.datesList}
        initialScrollIndex={todayIndex}
        getItemLayout={(data, index) => ({
          length: DATE_ITEM_WIDTH,
          offset: DATE_ITEM_WIDTH * index,
          index,
        })}
      />
      <Text style={styles.sectionTitle}>What you missed</Text>
      <FlatList
        horizontal
        data={postData}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        style={styles.postsList}
      />
    </>
  );



  return (
    <>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
        <StatusBar barStyle="light-content" />
          <FlatList
            ListHeaderComponent={ListHeader}
            data={communities}
            renderItem={renderCommunityItem}
            keyExtractor={(item) => item.key}
            style={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
          <TouchableOpacity
            onPress={handleCreateCommunity}
            style={styles.createCommunityButton}
          >
            <Text style={styles.communityTitle}>Create Community</Text>
          </TouchableOpacity>
          {selectedPost && (
            <PostDetailsModal
              post={selectedPost}
              isVisible={modalVisible}
              onComment={() => setCommentsModalVisible(!commentsModalVisible)}
              onClose={() => setModalVisible(false)}
            />
          )}
          <CommentModal
            isVisible={commentsModalVisible}
            onClose={() => setCommentsModalVisible(false)}
          />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    backgroundColor: "#000", // Set your background color
  },
  datesList: {
    flexGrow: 0, // Ensure the FlatList does not expand
  },
  communityTags: {
    color: "#fff",
    fontSize: 12,
  },
  textOverlay: {
    // Semi-transparent overlay for improved text readability
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 10,
  },
  dateItem: {
    width: DATE_ITEM_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  highlight: {
    backgroundColor: "#5C5CFF", // Your highlight color
    borderRadius: 10,
  },
  dateDay: {
    color: "#fff",
    fontSize: 16,
  },
  dateNumber: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 31,
    fontWeight: "bold",
    padding: 10,
  },

  postsList: {
    flexGrow: 0, // Ensure the FlatList does not expand
    paddingLeft: 10,
  },
  
  postImage: {
    width: 120, // Set your desired size
    height: 164,
    borderRadius: 10, // if you want rounded corners
    marginRight: 10,
  },
  communityItem: {
    height: 120, // Set a fixed height for your community item
    marginVertical: 10,
    marginHorizontal: 12,
    borderRadius: 10, // Rounded corners for the item
    overflow: "hidden", // This ensures the image respects the border radius
  },
  communityItemImageStyle: {
    opacity: 0.5, // Semi-transparent overlay for improved text readability
    borderRadius: 10, // If you want the image itself to have rounded corners
  },
  communityItemBackground: {
    flex: 1, // Ensure it fills the container
    justifyContent: "flex-end", // Align content to the bottom
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  postUser: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  postCaption: {
    fontSize: 16,
    marginVertical: 10,
  },
  communityTitle: {
    position: "absolute",
    top: 10,
    left: 10,
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  communityStreak: {
    position: "absolute",
    top: 20,
    left: 10,
    color: "#fff",
  },
  createCommunityButton: {
    backgroundColor: "#1e1e1e",
    position: "relative",
    height: 80,
    borderRadius: 10, // if you want rounded corners
    marginVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    maxHeight: Dimensions.get("window").height * 0.9,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  modalPostImage: {
    width: "100%",
    height: 600,
    borderRadius: 10,
    marginBottom: 10,
  },
  closeButton: {
    marginLeft: "auto",
    backgroundColor: "transparent",
    padding: 10,
    width: 40,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#333",
  },
  commentsList: {
    marginTop: 10,
  },
  // Restyle postComment if needed
  postComment: {
    fontSize: 14,
    color: "#333",
    paddingVertical: 4,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  actionButton: {
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 5,
    marginRight: 10, // Add some space between buttons
  },
  reactionMenu: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50, // Adjust based on your UI
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 5,
  },
  reactionIcon: {
    fontSize: 30, // Adjust based on your UI
    marginHorizontal: 5,
  },
});

export default Communities;
