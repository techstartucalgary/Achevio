import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons

type UserProfile = {
  name: string;
  avatar: string;
  bio: string;
  location?: string;
  followers?: number;
  following?: number;
  posts?: number;
};

const ProfilePage: React.FC = () => {
  const user: UserProfile = {
    name: 'Magdy',
    avatar: 'https://avatars.githubusercontent.com/u/17571969?v=4',
    bio: 'Enthusiastic developer and designer',
    location: 'Egypt, Cairo',
    followers: 1200,
    following: 300,
    posts: 28,
  };

  // Function to handle Edit Profile action
  const handleEditProfile = () => {
    console.log('Edit Profile Clicked');
    // Implement navigation or state update
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-on" size={16} color="gray" />
          <Text style={styles.location}>{user.location}</Text>
        </View>
        <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        {/* You can further break down each stat into a separate component */}
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{user.posts}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{user.followers}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{user.following}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {/* Gallery or Posts Section */}
      <View style={styles.galleryContainer}>
        {/* Here you would map through an array of images/posts */}
        <Image style={styles.postImage} source={{ uri: 'link-to-image' }} />
        {/* Repeat for multiple images */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 16,
    color: 'grey',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 40, // To ensure text is centered and doesn't overflow
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  location: {
    marginLeft: 2,
    fontSize: 14,
    color: 'grey',
  },
  editProfileButton: {
    marginTop: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  editProfileText: {
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: 'grey',
    marginTop: 4,
  },
  galleryContainer: {
    flexDirection: 'row', // or 'column' depending on your design
    flexWrap: 'wrap', // if you want multiple rows
    justifyContent: 'center',
    paddingVertical: 20,
  },
  postImage: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
  // ... Add more styles for other elements
});

export default ProfilePage;
