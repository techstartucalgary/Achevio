import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  ImageBackground,
  Button,
  Alert,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { set } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faComment, faEllipsisV, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import axios from "axios";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { setUsername } from "../redux/actions";


const screenWidth = Dimensions.get("window").width;
type Post = {
  id: string;
  title : string;
  caption: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  community_id: string;
  imageUrl: string;
  user: string;
  userImage: string;
};
// const postData: Post[] = [
//   {
//     id: "1",
//     imageUrl:
//       "https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais",
//     description: "Painting of a flower.",
//     user: "user1",
//     userImage:
//       "https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais",
//   },
//   {
//     id: "2",
//     imageUrl:
//       "https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais",
//     description: "Featured painting.",
//     user: "user2",
//     userImage:
//       "https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais",
//   },
//   {
//     id: "3",
//     imageUrl:
//       "https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais",
//     description: "Painting of a sunset.",
//     user: "user3",
//     userImage:
//       "https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais",
//   },
//   {
//     id: "4",
//     imageUrl:
//       "https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais",
//     description: "Painting of a flower.",
//     user: "user4",
//     userImage:
//       "https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais",
//   },
//   {
//     id: "5",
//     imageUrl:
//       "https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais",
//     description: "Painting of a flower.",
//     user: "user5",
//     userImage:
//       "https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais",
//   },
//   // ...more posts
// ];

const CommunityPage: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { url } = useSelector((state: any) => state.user);
  const [username, setUsername] = useState<string>("");
  const [communityTagArray, setCommunityTagArray] = useState<string[]>([]);
  const [isLargeView, setIsLargeView] = useState<boolean>(false);
  const params = useLocalSearchParams();
  const [postData, setPostData] = useState<Post[]>([]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { communityId, communityName, communityStreak, communityTags, communityImage } = params;
  const handleLikePress = () => {
    // You would have some logic to handle the like action here
    console.log("Like button pressed!");
  };
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const handlePress = () => {
    setIsLargeView(!isLargeView);
  };
  const getUserName = async (userId: string) => {
    console.log("Fetching user info for user:", userId);
    const res = await axios.get(`${url}/user/GetNameByID/${userId}`);
    if (res.status === 200) {
      console.log("User info fetched successfully:", res.data);
      setUsername(res.data);
    }
  }
  const fetchPosts = async () => {
    console.log("Fetching posts for community:", communityId);
    const res = await axios.get(`${url}/posts/community/${communityId}`);
    console.log("Posts fetched successfully:", res.data);
    if (res.status === 200) {
      console.log("Posts fetched successfully:", res.data);

      const updatedPosts = res.data.map((post) => {
        getUserName(post.user_id);
        return {
            ...post, // Spread the existing fields
            imageUrl: post.imageUrl || `${url}/post/image/${post.id}.jpg`, 
            user: username,
            userImage: post.userImage ||  `${url}/users/image/${post.user_id}.jpg` 
        };
    });

    setPostData(updatedPosts);

    }
  }

  useEffect(() => {
    const fetchData = async () => {
      console.log(
        "Communities:",
        communityId,
        communityName,
        communityStreak,
        communityTags
      );
      const communityTagArray = Array.isArray(communityTags) ? communityTags : communityTags.split(",");
      console.log("Community Tags:", communityTagArray);
      setCommunityTagArray(communityTagArray);
      await fetchPosts();
    };

    fetchData();
  }, [communityId, communityName, communityStreak, communityTags]);

  const renderPost = ({ item }: { item: Post }) => {
    const postStyle = isLargeView ? styles.largePost : styles.post;

    const imageStyle = isLargeView ? styles.largePostImage : styles.postImage;
    return (
      <TouchableOpacity onPress={() => handlePress()} style={postStyle}>
        {isLargeView && (
          <View style={styles.userContainer}>
            <Image style={styles.userImage} source={{ uri: item.userImage }} />
            <Text style={styles.userText}>{item.user}</Text>
          </View>
        )}
        <Image source={{ uri: item.imageUrl }} style={imageStyle} />
        {isLargeView && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              onPress={handleLikePress}
              style={styles.actionButton}
            >
              <FontAwesomeIcon icon={faHeart} size={24} color={"#555"} />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    // Start the fade-in animation when the component mounts
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  
  const LeaveCommunity = async () => {
    console.log("Leaving Community");
    const res = await axios.delete(`${url}/community/${communityId}/leave`);
    console.log(res.data);
    if (res.status === 204) {
      console.log("Community left successfully:", res.data);
      Alert.alert("Community left successfully");
      router.push({
        pathname: '/(tabs)/Communities',
        params:{
          refresh: "true"
        }
      });
    }
  };
  
  const CheckCommunityStatus = () => {
    console.log("Checking Community Status");
    // Implement the logic to check the status of the community
  };
  

  const JoinCommunity = async() => {
    console.log("Joining Community");
    const res = await axios.put(`${url}/community/join/${communityId}`);
    console.log(res.data);
    if (res.status === 200) {
      console.log("Community joined successfully:", res.data);
      Alert.alert("Community joined successfully");
      router.push({
        pathname: '/(tabs)/Communities',
        params:{
          refresh: "true"
        }
      });
    }
  }
  const renderHeader = useCallback(() => (
    <Animated.View style={{ ...styles.headerContainer, opacity: fadeAnim }}>
      <ImageBackground
        source={{ uri: communityImage as string }}
        style={{ width: "100%", height: "100%", position: "absolute" }}
      >
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,2.0)"]}
        style={styles.gradientHeader}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 0.0, y: 1.0 }}
      >
        <Text style={styles.headerTitle}>{communityName}</Text>
      </LinearGradient>
      </ImageBackground>



      <View style={styles.overlayContent}>
      <TouchableOpacity onPress={() => setIsMenuVisible(!isMenuVisible)} style={{ position: "absolute", top: 50, right: 30 }}>
          <FontAwesomeIcon icon={faEllipsisV} size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.streakText}>{communityStreak}</Text>
        <View style={styles.tagContainer}>
          {Array.isArray(communityTagArray) && communityTagArray.map((tag: string) => (
            <View style={styles.tag} key={tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <Button title = "Join Community" onPress = {JoinCommunity}/>
        <View style={styles.statsContainer}>
          <Text style={styles.statText}>56 Followers</Text>
          <Text style={styles.statText}>198 Posts</Text>
        </View>
      </View>
    </Animated.View>
  ), [communityName, communityStreak, communityTagArray, communityImage, fadeAnim]);

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim, marginTop:0, padding:0}}>
      <Pressable
      onPress={() => setIsMenuVisible(false)}>
      <FlatList
        style={{borderRadius: 25, overflow: "hidden" }}
        key={selectedPostId ? "single-column" : "multi-column"} // Unique key based on layout
        data={postData}
        ListHeaderComponent={renderHeader}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        numColumns={selectedPostId ? 1 : 2}
        columnWrapperStyle={!isLargeView ? styles.row : null}
        showsVerticalScrollIndicator={false}
      />
    </Pressable>

    {isMenuVisible && (
      <View style={styles.menuContainer}>
          <TouchableOpacity onPress={JoinCommunity} style={styles.menuOption}>
            <Text style={styles.menuText}>Join Community</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={LeaveCommunity} style={styles.menuOption}>
            <Text style={styles.menuText}>Leave Community</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={CheckCommunityStatus} style={styles.menuOption}>
            <Text style={styles.menuText}>Check Status</Text>
          </TouchableOpacity>
        </View>
      )}

    </Animated.View>

  );
};
const styles = StyleSheet.create({
  headerContainer: {
    height: 300,
    width: "100%",
    borderRadius: 25,
    overflow: "hidden",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  gradientHeader: {
    position: "absolute",
    width: "100%",
    height: "100%",

  },
  headerTitle: {
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 60,
    color: "#fff",
  },
  overlayContent: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  userText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  streakText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    paddingVertical: 5,
    width: "100%",
  },
  postDescription: {
    fontSize: 16,
    color: "#333",
    padding: 10,
  },
  tagContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
  },
  tag: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  tagText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 50,
    paddingTop: 10,
  },
  statText: {
    fontSize: 16,
    color: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 30,
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
  largePost: {
    marginTop: 20,
    width: "100%",
    padding: 4,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  largePostImage: {
    width: "100%",
    height: 300, // Adjust the height to maintain aspect ratio
    borderRadius: 10,
  },
  post: {
    width: screenWidth / 2 - 4,
    height: screenWidth / 2,
    padding: 4,
  },
  postImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  row: {
    flex: 1,
    justifyContent: "space-around",
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
  commentsButton: {
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "flex-start", // Align button to the start of the text
  },
  commentsButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    position: 'absolute',
    top: 40, // Adjust based on the position of the three dots button
    right: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuOption: {
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  
});
export default CommunityPage;
