import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Dimensions, Text, ImageBackground, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import CachedImage from 'react-native-expo-cached-image';

const { width, height } = Dimensions.get('window');


const PostPage: React.FC = () => {
    const params = useLocalSearchParams();
    const { communityId, url, selectedPost } = params;
    const [posts, setPosts] = useState<Post[]>([]);
    const [showReactionMenu, setShowReactionMenu] = useState(false);
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
}, [params.postData]);

const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
    <Pressable onLongPress={handleLongPress}>
      <CachedImage isBackground source={{ uri: item.imageUrl }} style={styles.postImage}>

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradientOverlay}
        >
      {showReactionMenu && <ReactionMenu showReactionMenu={showReactionMenu} setShowReactionMenu={setShowReactionMenu} />}

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
      pagingEnabled
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      initialNumToRender={4}
      onEndReachedThreshold={0.5}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
    />
  );
};


const styles = StyleSheet.create({
    postContainer: {
      width,
      height,
      backgroundColor: '#fff',
    },
    postImage: {
      width: '100%',
      height: '100%',
    },
    gradientOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingBottom: 20,
    },
    postDetails: {
      padding: 15,
    },
    postTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 5,
    },
    postCaption: {
      fontSize: 16,
      color: 'white',
    },
    iconRow: {
      flexDirection: 'row',
      marginTop: 10,
    },
    icon: {
      marginLeft: 15,
    },
    reactionMenu: {
        flexDirection: 'row',
        position: 'absolute',
        top: height/2,
        left: width/2 - 100,
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 5,
      },
      reactionIcon: {
        fontSize: 30, // Adjust based on your UI
        marginHorizontal: 5,
      },
  });
  
  export default PostPage;