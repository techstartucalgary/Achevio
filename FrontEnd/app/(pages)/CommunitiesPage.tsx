import React, {useEffect, useRef, useState} from 'react';
import { Animated, View, Text, Image, StyleSheet, FlatList, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {router, useLocalSearchParams} from 'expo-router';
import { set } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons';

const screenWidth = Dimensions.get('window').width;
type Post = {
  id: string;
  imageUrl: string;
  description: string;
  large?: boolean;
  userImage?: string;
  user?: string;
};
const postData: Post[] = [
  { id: '1', imageUrl: 'https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais', description: 'Painting of a flower.', user : 'user1', userImage: 'https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais' },
  { id: '2', imageUrl: 'https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais', description: 'Featured painting.', user : 'user2', userImage: 'https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais' },
  { id: '3', imageUrl: 'https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais', description: 'Painting of a sunset.', user : 'user3', userImage: 'https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais' },
  { id: '4', imageUrl: 'https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais', description: 'Painting of a flower.', user : 'user4', userImage: 'https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais' },
  { id: '5', imageUrl: 'https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais', description: 'Painting of a flower.', user : 'user5', userImage: 'https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais' },
  // ...more posts
];


const CommunityPage: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isLargeView, setIsLargeView] = useState<boolean>(false);
  const params = useLocalSearchParams();
  const {communityId, communityName, communityStreak, communityTags} = params;
  const handleLikePress = () => {
    // You would have some logic to handle the like action here
    console.log('Like button pressed!');
  };
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const handlePress = () => {
    setIsLargeView(!isLargeView);
  };
  
  const renderPost = ({ item }: { item: Post }) => {
    const isSelected = item.id === selectedPostId;
    const postStyle = isLargeView ? styles.largePost : styles.post;

    const imageStyle = isLargeView ? styles.largePostImage : styles.postImage;
    return (
      <TouchableOpacity onPress={() => handlePress()} style={postStyle}>
        {isLargeView &&
        <View style={styles.userContainer}>
          <Image style={styles.userImage} source={{ uri: item.userImage }} />
          <Text style={styles.userText}>{item.user}</Text>
        </View>
        }
        <Image source={{ uri: item.imageUrl }} style={imageStyle} />
        {isLargeView && 
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            onPress={handleLikePress} 
            style={styles.actionButton}
          >
            <FontAwesomeIcon icon={faHeart} size={24} color={"#555"} />
          </TouchableOpacity>
        </View>
      }
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
  const renderHeader = () => (
    
    <Animated.View style={{...styles.headerContainer, opacity: fadeAnim}}>
      <LinearGradient
        colors={['#FFB6C1', '#FA8072']}
        style={styles.gradientHeader}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 0.0, y: 1.0 }}
      >
        <Text style={styles.headerTitle}>{communityName}</Text>
      </LinearGradient>
      <View style={styles.overlayContent}>
        <Text style={styles.streakText}>{communityStreak}</Text>
        <View style={styles.tagContainer}>
          <View style={styles.tag}><Text style={styles.tagText}>Art</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>Creativity</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>Painting</Text></View>
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.statText}>56 Followers</Text>
          <Text style={styles.statText}>198 Posts</Text>
        </View>
      </View>
      </Animated.View>
  );

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
    {renderHeader()}
      <FlatList
        style= {{marginTop: 20, borderRadius: 25, overflow: 'hidden'}}
        key={selectedPostId ? 'single-column' : 'multi-column'} // Unique key based on layout
        data={postData}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        numColumns={selectedPostId ? 1 : 2}
        columnWrapperStyle={!isLargeView ? styles.row : null}
        />

    </Animated.View>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    height: 300,
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',

  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  gradientHeader: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    color: '#fff',
  },
  overlayContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  userText: { 
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  streakText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 5,
    width: '100%',
  },
  postDescription: {
    fontSize: 16,
    color: '#333',
    padding: 10,

  },
  tagContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  tagText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    paddingTop: 10,
  },
  statText: {
    fontSize: 16,
    color: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 30,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  actionButton: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 5,
    marginRight: 10, // Add some space between buttons
  },
  largePost: {
    marginTop: 20,
    width: "100%",
    padding: 4,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  largePostImage: {
    width: '100%',
    height: 300, // Adjust the height to maintain aspect ratio
    borderRadius: 10,
  },
  post: {
    width: screenWidth / 2 - 4,
    height: screenWidth / 2,
    padding: 4,
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  commentsButton: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-start', // Align button to the start of the text
  },
  commentsButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  
});
export default CommunityPage;
