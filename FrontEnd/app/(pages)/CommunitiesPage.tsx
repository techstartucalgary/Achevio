import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  ImageBackground,
  Button,
  Alert,
  Pressable,
  PanResponder,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { set } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faComment,
  faEllipsisV,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import axios from "axios";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { setUsername } from "../redux/actions/actions";
import LottieView from "lottie-react-native";

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

const screenWidth = Dimensions.get("window").width;
const largeImageSize = screenWidth * 0.45;
const smallImageSize = (screenWidth * 0.45 - 3) / 2; // Adjust margin/padding as needed

const CommunityPage: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { url } = useSelector((state: any) => state.user);
  const [communityTagArray, setCommunityTagArray] = useState([]);
  const params = useLocalSearchParams();
  const [rows, setRows] = useState([]);
  const [postData, setPostData] = useState<Post[]>([]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const {
    communityId,
    communityName,
    communityStreak,
    communityTags,
    communityImage,
  } = params;
  const [showReactionMenu, setShowReactionMenu] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const position = useRef(new Animated.ValueXY()).current;
  const screenHeight = Dimensions.get("window").height;
  const [isFollowersModalVisible, setIsFollowersModalVisible] = useState(false);
  const [followers, setFollowers] = useState([]);
  const ReactionMenu = () => {
    return (
      <View style={styles.reactionMenu}>
        {/* Icons represent reactions, you can use images or icons from a library like react-native-vector-icons */}
        <Text style={styles.reactionIcon}>👍</Text>
        <Text style={styles.reactionIcon}>❤️</Text>
        <Text style={styles.reactionIcon}>😂</Text>
        <Text style={styles.reactionIcon}>😮</Text>
        <Text style={styles.reactionIcon}>😢</Text>
        <Text style={styles.reactionIcon}>😡</Text>
      </View>
    );
  };

  const handleJumpToPost = (index) => {
    router.push({
      pathname: "/(pages)/PostPage",
      params: {
        communityId: communityId,
        url: url,
        selectedIndex: index, // Pass the index as a parameter
      },
    });
  };
  const RowItem = ({ largeUri, smallUris, isReversed = false, startIndex }) => (
    <View
      style={{
        flexDirection: isReversed ? "row-reverse" : "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 3,
      }}
    >
      <TouchableOpacity onPress={() => handleJumpToPost(startIndex)}>
        <Image
          source={{ uri: largeUri }}
          style={{
            height: largeImageSize,
            width: largeImageSize,
            marginRight: isReversed ? 0 : 3,
            marginLeft: isReversed ? 3 : 0,
          }}
          cachePolicy="memory-disk"
        />
      </TouchableOpacity>
      <View
        style={{
          height: largeImageSize,
          width: largeImageSize,
          flexDirection: "column", // Adjust this to align items vertically in two rows
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 3,
          }}
        >
          {smallUris.slice(0, 2).map((uri, index) => (
            <TouchableOpacity
              key={uri} // Make sure uri is unique, otherwise, consider another key
              onPress={() => handleJumpToPost(startIndex + index + 1)}
              style={{ width: smallImageSize, height: smallImageSize }}
            >
              <Image
                source={{ uri }}
                style={{ height: "100%", width: "100%" }}
                cachePolicy="memory-disk"
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {smallUris.slice(2, 4).map((uri, index) => (
            <TouchableOpacity
              key={uri} // Make sure uri is unique, otherwise, consider another key
              onPress={() => handleJumpToPost(startIndex + index + 3)} // Adjust index calculation for the second row
              style={{ width: smallImageSize, height: smallImageSize }}
            >
              <Image
                source={{ uri }}
                style={{ height: "100%", width: "100%" }}
                cachePolicy="memory-disk"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const LeftoverImagesRow = ({ uris, index }) => (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 3,
      }}
    >
      {uris.map((uri, index) => (
        <Image
          key={index}
          source={{ uri }}
          style={{ height: largeImageSize, width: largeImageSize, margin: 3 }}
          cachePolicy="memory-disk"
        />
      ))}
    </View>
  );
  const prepareRows = (images) => {
    const rows = [];
    for (let i = 0; i < images.length; i += 5) {
      const row = {
        type: "row",
        largeUri: images[i],
        smallUris: images.slice(i + 1, i + 5),
        startIndex: i, // Add the startIndex here
      };
      rows.push(row);
    }
    return rows;
  };

  const renderItem = useCallback(({ item, index }) => {
    switch (item.type) {
      case "row":
        return (
          <RowItem
            largeUri={item.largeUri}
            smallUris={item.smallUris}
            isReversed={index % 2 !== 0}
            startIndex={item.startIndex} // Pass startIndex here
          />
        );
      case "leftovers":
        return <LeftoverImagesRow uris={item.uris} index={index} />;
      default:
        return null; // Just in case
    }
  }, []);

  const handleLongPress = () => {
    setShowReactionMenu(true);
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
        setPostData(postsWithUsernames);
        const rows = prepareRows(
          postsWithUsernames.map((post) => post.imageUrl)
        );
        setRows(rows);
        console.log("Posts:", postData);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchFollowers = async () => {
    console.log("Fetching followers for community:", communityId);
    try {
      const res = await axios.get(
        `${url}/community/${communityId}/getAllUsers`
      );
      if (res.status === 200) {
        console.log("Followers fetched successfully:", res.data);
        const followersMap = await Promise.all(
          res.data.map(async (follower) => {
            const username = follower.username;
            const userImage = `${url}/user/image/${follower.id}.jpg`;
            return {
              username,
              userImage,
            };
          })
        );
        setFollowers(followersMap);
        console.log("Followers:", followers);
      }
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log(
        "Communities:",
        communityId,
        communityName,
        communityStreak,
        communityTags
      );

      setRefreshing(true);
      await fetchPosts();
      await fetchFollowers();
      const parsedTags = ((communityTags || "") as string)
        .split(",")
        .map((tagWithColor) => {
          const [text, color] = tagWithColor.split(" ");
          return { text, color };
        });

      setCommunityTagArray(parsedTags);
      setRefreshing(false);
    };

    fetchData();
  }, [communityId]);

  useEffect(() => {
    // Start the fade-in animation when the component mounts
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dy: position.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        // Check if the swipe was upwards and significant
        if (gestureState.dy < -150) {
          // Note the negative value for upward movement
          closeModal();
        } else {
          // Reset position if not swiped up significantly
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;
  const closeModal = () => {
    Animated.timing(position, {
      toValue: { x: 0, y: -screenHeight }, // Animate the modal off the top of the screen
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };
  const PostDetailModal = ({ isVisible, post, onClose }) => {
    if (!post) return null;

    useEffect(() => {
      if (isVisible) {
        position.setValue({ x: 0, y: 0 });
      }
    }, [isVisible]);

    const formatDate = (dateString) => {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString(
        undefined,
        options as Intl.DateTimeFormatOptions
      );
    };

    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={isVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [{ translateY: position.getLayout().top }],
              },
            ]}
            {...panResponder.panHandlers}
          >
            <View style={styles.userInfoContainer}>
              <Image
                source={{ uri: post.userImage }}
                style={styles.userImage}
              />
              <Text style={styles.username}>{post.user}</Text>
            </View>

            <Pressable
              onLongPress={handleLongPress}
              onPressOut={() => setShowReactionMenu(false)}
            >
              <Image
                source={{ uri: post.imageUrl }}
                style={styles.modalPostImage}
              />
              {showReactionMenu && <ReactionMenu />}
            </Pressable>

            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{post.title}</Text>

              <Text style={styles.modalCaption}>{post.caption}</Text>
              <Text style={styles.modalTimestamp}>
                {formatDate(post.created_at)}
              </Text>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  const FollowersModal = ({ isVisible, followers, onClose }) => {
    if (!followers) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => setIsFollowersModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={followers}
              ListHeaderComponent={
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: 10,
                  }}
                >
                  Followers
                </Text>
              }
              renderItem={({ item }) => (
                console.log("Item:", item),
                (
                  <View
                    style={{
                      flexDirection: "column",
                    }}
                  >
                    <View style={styles.userInfo}>
                      <Image
                        source={{ uri: item.userImage }} // Use the correct property to set the image source
                        style={styles.modalUserImage}
                      />
                      <Text
                        style={{
                          fontSize: 18,
                          color: "black",
                          padding: 10,
                        }}
                      >
                        {item.username}
                      </Text>
                    </View>
                  </View>
                )
              )}
              keyExtractor={(item, index) => item.username + index} // Use a unique key for each item
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsFollowersModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const LeaveCommunity = async () => {
    console.log("Leaving Community");
    const res = await axios.delete(`${url}/community/${communityId}/leave`);
    console.log(res.data);
    if (res.status === 204) {
      console.log("Community left successfully:", res.data);
      Alert.alert("Community left successfully");
      router.push({
        pathname: "/(tabs)/Communities",
        params: {
          refresh: "true",
        },
      });
    }
  };

  const CheckCommunityStatus = () => {
    console.log("Checking Community Status");
    // Implement the logic to check the status of the community
  };

  const JoinCommunity = async () => {
    console.log("Joining Community");
    const res = await axios.put(`${url}/community/join/${communityId}`);
    console.log(res.data);
    if (res.status === 200) {
      console.log("Community joined successfully:", res.data);
      Alert.alert("Community joined successfully");
      router.push({
        pathname: "/(tabs)/Communities",
        params: {
          refresh: "true",
        },
      });
    }
  };
  const renderHeader = useCallback(
    () => (
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
          <TouchableOpacity
            onPress={() => setIsMenuVisible(!isMenuVisible)}
            style={{ position: "absolute", top: 50, right: 30 }}
          >
            <FontAwesomeIcon icon={faEllipsisV} size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.streakText}>{communityStreak}</Text>
          <View style={styles.tagContainer}>
            {communityTagArray.map(({ text, color }, index) => (
              <View
                key={index}
                style={[
                  styles.tag,
                  { backgroundColor: color || "rgba(255, 255, 255, 0.6)" },
                ]}
              >
                <Text style={styles.tagText}>{text}</Text>
              </View>
            ))}
          </View>

          <View style={styles.statsContainer}>
            <Text
              style={styles.statText}
              onPress={() => {
                setIsFollowersModalVisible(true);
              }}
            >
              {followers.length} Followers
            </Text>
            <Text style={styles.statText}>{postData.length} posts</Text>
          </View>
        </View>
      </Animated.View>
    ),
    [
      communityName,
      communityStreak,
      communityTagArray,
      communityImage,
      fadeAnim,
    ]
  );
  const CustomLoadingScreen = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LottieView
          source={require("../../assets/rocketLoad.json")}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>
    );
  };
  return (
    <Animated.View
      style={{ flex: 1, opacity: fadeAnim, marginTop: 0, padding: 0 }}
    >
      <Pressable onPress={() => setIsMenuVisible(false)} style={{ flex: 1 }}>
        {refreshing ? (
          <CustomLoadingScreen />
        ) : (
          <FlatList
            style={{ borderRadius: 25, overflow: "hidden" }}
            key={selectedPostId ? "single-column" : "multi-column"} // Unique key based on layout
            data={rows}
            ListHeaderComponent={renderHeader}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            initialNumToRender={8}
            onEndReachedThreshold={0.5}
            maxToRenderPerBatch={5}
            updateCellsBatchingPeriod={30}
          />
        )}
        <PostDetailModal
          isVisible={modalVisible}
          post={selectedPost}
          onClose={() => setModalVisible(false)}
        />
        <FollowersModal
          isVisible={isFollowersModalVisible}
          followers={followers}
          onClose={() => setIsFollowersModalVisible(false)}
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
          <TouchableOpacity
            onPress={CheckCommunityStatus}
            style={styles.menuOption}
          >
            <Text
              style={styles.menuText}
              onPress={() => {
                router.push({
                  pathname: "/(pages)/CommunityStatus",
                  params: {
                    communityId: communityId,
                  },
                });
              }}
            >
              Check Status
            </Text>
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
  animation: {
    width: 120, // Adjust the size as needed
    height: 120, // Adjust the size as needed
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
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    position: "absolute",
    top: 40, // Adjust based on the position of the three dots button
    right: 10,
    shadowColor: "#000",
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
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
  },
  modalPostImage: {
    width: "100%",
    height: 500,
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    position: "absolute",
    right: 20,
  },
  modalCaption: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "left",
    padding: 10,
  },
  modalTimestamp: {
    fontSize: 14,
    color: "#666",
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  gradientFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    padding: 10,
  },
  modalUserImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  modalUsername: {
    fontSize: 18,
    color: "white",
  },

  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  reactionMenu: {
    flexDirection: "row",
    position: "absolute",
    bottom: 50, // Adjust based on your UI
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 5,
  },
  reactionIcon: {
    fontSize: 30, // Adjust based on your UI
    marginHorizontal: 5,
  },
});
export default CommunityPage;
