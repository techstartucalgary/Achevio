import React, {useEffect, useRef} from 'react';
import { Animated, View, Text, Image, StyleSheet, FlatList, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;
type Post = {
  id: string;
  imageUrl: string;
  description: string;
  large?: boolean;
};
const postData: Post[] = [
  { id: '1', imageUrl: 'https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais', description: 'Painting of a flower.' },
  { id: '2', imageUrl: 'https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais', description: 'Featured painting.' },
  { id: '3', imageUrl: 'https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais', description: 'Painting of a sunset.' },
  { id: '4', imageUrl: 'https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais', description: 'Painting of a flower.' },
  { id: '5', imageUrl: 'https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1704499200&semt=ais', description: 'Painting of a flower.' },
  // ...more posts
];

const CommunityPage: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the fade-in animation when the component mounts
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Duration in milliseconds
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  }, [fadeAnim]);
  const renderPost = ({ item }: { item: Post }) => {
    const postStyle = item.large ? styles.largePost : styles.post;
    const imageStyle = item.large ? styles.largePostImage : styles.postImage;
    return (
      <View style={postStyle}>
        <Image source={{ uri: item.imageUrl }} style={imageStyle} />
        {/* Add description if needed */}
      </View>
    );
  };
  const renderHeader = () => (
    <Animated.View style={{...styles.headerContainer, opacity: fadeAnim}}>
      <LinearGradient
        colors={['#FFB6C1', '#FA8072']}
        style={styles.gradientHeader}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 0.0, y: 1.0 }}
      >
        <Text style={styles.headerTitle}>Paint Pals</Text>
      </LinearGradient>
      <View style={styles.overlayContent}>
        <Text style={styles.streakText}>42 Day Streak 🔥</Text>
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
    <Animated.View style={{flex: 1, opacity: fadeAnim}}>

    <FlatList
      ListHeaderComponent={renderHeader}
      data={postData}
      renderItem={renderPost}
      keyExtractor={item => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
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
  streakText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 5,
    width: '100%',
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
  largePost: {
    width: screenWidth,
    padding: 4,
  },
  largePostImage: {
    width: '100%',
    height: screenWidth / 2, // Adjust the height to maintain aspect ratio
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
});
export default CommunityPage;
