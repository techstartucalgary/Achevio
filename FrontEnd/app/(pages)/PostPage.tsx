import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  Text,
  ImageBackground,
  Pressable,
  Animated,
} from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import CachedImage from "react-native-expo-cached-image";
import index from "../(Login)";

const { width, height } = Dimensions.get("window");
const ITEM_HEIGHT = height; // Change this to match the height of your items

const PostPage: React.FC = () => {
  const params = useLocalSearchParams();
  const { communityId, url, selectedIndex } = params;
  console.log("selectedPostId", selectedIndex);
  const [posts, setPosts] = useState<Post[]>([]);
  const scrollOffsetAnimated = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
    const jumpToIndex = (index) => {
    flatListRef.current?.scrollToIndex({ animated: true, index });
  };
  const getItemLayout = (data, index) => (
    { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
  );
  
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  const ReactionMenu = ({ showReactionMenu, setShowReactionMenu }) => {
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

  type Post = {
    id: string;
    title: string;
    caption: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    community_id: string;
    imageUrl: string;
    user: string;
    userImage: string;
  };
  const fetchPosts = async () => {
    console.log("Fetching posts for community:", communityId);
    try {
      const res = await axios.get(`${url}/posts/community/${communityId}`);
      if (res.status === 200) {
        console.log("Posts fetched successfully:", res.data);

        // Fetch usernames in parallel
        const postsWithUsernames = await Promise.all(
          res.data.map(async (post) => {
            try {
              const usernameResponse = await axios.get(
                `${url}/user/GetNameByID/${post.user_id}`
              );
              console.log("userid", post.user_id);
              const username = usernameResponse.data; // Assuming this is the username directly

              return {
                ...post,
                imageUrl: `${url}/post/image/${post.id}.jpg`,
                user: username,
                userImage: `${url}/user/image/${post.user_id}.jpg`,
              };
            } catch (error) {
              console.error("Error fetching user info:", error);
              return post; // Return the original post if there was an error fetching the username
            }
          })
        );
        setPosts(postsWithUsernames);
        console.log("Posts:", postsWithUsernames);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  const handleLongPress = () => {
    setShowReactionMenu(!showReactionMenu);
  };

  useEffect(() => {
    fetchPosts();

    console.log("Posts: ", posts);
  
  }, [selectedIndex]);
  // useFocusEffect(() => {

  //   gotoindex();

  // }
  // );
  // const gotoindex = () => {
  //   const indexToScrollTo = parseInt(selectedIndex.toString());
  
  //   // Make sure you check that the FlatList is mounted and your data is loaded
  //   if (flatListRef.current && posts.length > 0) {
  //     // Use a timeout to give the FlatList time to render its items
  //       smoothScrollToOffset(indexToScrollTo * ITEM_HEIGHT);

  //   }
  // }
  // const smoothScrollToOffset = (finalOffset) => {
  //   // Reset scrollOffsetAnimated to 0 before starting a new animation
  //   scrollOffsetAnimated.setValue(0);
  
  //   Animated.timing(scrollOffsetAnimated, {
  //     toValue: finalOffset, // Final scroll position
  //     duration: 1000, // Duration of the scroll animation
  //     useNativeDriver: true, // Use native driver for better performance
  //   }).start();
  
  //   // Listen to changes in scrollOffsetAnimated and scroll accordingly
  //   scrollOffsetAnimated.addListener(({ value }) => {
  //     flatListRef.current.scrollToOffset({ offset: value, animated: false });
  //   });
  // };
  
  
  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <Pressable onLongPress={handleLongPress}>
        <CachedImage
          isBackground
          source={{ uri: item.imageUrl }}
          style={styles.postImage}
          resizeMode="cover" // This ensures the image covers the allotted space without altering its aspect ratio
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.gradientOverlay}
          >
            {showReactionMenu && (
              <ReactionMenu
                showReactionMenu={showReactionMenu}
                setShowReactionMenu={setShowReactionMenu}
              />
            )}

            <View style={styles.postDetails}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postCaption}>{item.caption}</Text>
              {/* Icons for interaction */}
              {/* <View style={styles.iconRow}>
              <FontAwesome name="heart-o" size={24} color="white" />
              <FontAwesome name="comment-o" size={24} color="white" style={styles.icon} />
              <FontAwesome name="send-o" size={24} color="white" style={styles.icon} />
            </View> */}
            </View>
          </LinearGradient>
        </CachedImage>
      </Pressable>
    </View>
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      initialNumToRender={4}
      onEndReachedThreshold={0.5}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      windowSize={5}
      ref={flatListRef}
      initialScrollIndex={parseInt(selectedIndex.toString())}
      getItemLayout={getItemLayout}
      pagingEnabled // Enable paging for a more natural scroll experience
    />
  );
};

const styles = StyleSheet.create({
  postContainer: {
    width: width,
    height: height,
    backgroundColor: "#fff",
    
  },
  postImage: {
    width: '100%',
    height: height
  },
  
  gradientOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  postDetails: {
    padding: 15,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  postCaption: {
    fontSize: 16,
    color: "white",
  },
  iconRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  icon: {
    marginLeft: 15,
  },
  reactionMenu: {
    flexDirection: "row",
    position: "absolute",
    top: height / 2,
    left: width / 2 - 100,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 5,
  },
  reactionIcon: {
    fontSize: 30, // Adjust based on your UI
    marginHorizontal: 5,
  },
});

export default PostPage;
