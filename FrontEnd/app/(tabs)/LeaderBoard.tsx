import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Dummy data for the leaderboard
const LEADERBOARD_DATA = [
  { id: '1', username: 'Some username', score: 2050, trend: 'up' },
  { id: '2', username: 'Some username', score: 1847, trend: 'down' },
  { id: '3', username: 'Some username', score: 1674, trend: 'up' },
  { id: '4', username: 'Some username', score: 1560, trend: 'down' },
  { id: '5', username: 'Some username', score: 1452, trend: 'up' },
  { id: '6', username: 'Some username', score: 1345, trend: 'down' },
  { id: '7', username: 'Some username', score: 1230, trend: 'up' },
  { id: '8', username: 'Some username', score: 1120, trend: 'down' },
  { id: '9', username: 'Some username', score: 1010, trend: 'up' },
  { id: '10', username: 'Some username', score: 950, trend: 'down' },
  // Add more users as necessary...
];

// Sort the data based on score
const sortedData = LEADERBOARD_DATA.sort((a, b) => b.score - a.score);

const LeaderboardScreen = () => {
  // Component to render each top user with rank and gradient
  const renderTopUser = (user, index) => {
    const isHighest = index === 0; 
    return (
      <View key={user.id} style={styles.topUserContainer}>
        {isHighest && <Image source={require('../../assets/images/crown.jpg')} style={styles.crown} />}

          <Image source={require('../../assets/images/dummyuser.png')} style={styles.avatar} />
          <LinearGradient
          // Adjust colors to your gradient preference
          colors={isHighest ? ['#ffeaa7', '#f1c40f'] : ['#dfe6e9', '#b2bec3']}
          style={[styles.linearGradient, { height: isHighest ? 150 : 100 }]}
        >
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.score}>{user.score}</Text>
        </LinearGradient>
      </View>
    );
  };

  // Component to render each user in the full list
  const renderUserItem = (user) => (
    <View key={user.id} style={styles.userItem}>
      <View style={styles.avatarContainer}>
        <Image source={require('../../assets/images/dummyuser.png')} style={styles.avatar} />
      </View>
      <Text style={styles.username}>{user.username}</Text>
      <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: 'auto' }}>
        <Image
          source={user.trend === 'up' ? require('../../assets/images/arrowup.png') : require('../../assets/images/arrowdown.png')}
          style={styles.trendIcon}
        />
        <Text style={[styles.trendScore, { color: user.trend === 'up' ? 'green' : 'red' }]}>{user.score}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Leader board</Text>
      <View style={styles.topUsers}>
        {renderTopUser(sortedData[1], 1)}
        {renderTopUser(sortedData[0], 0)}
        {renderTopUser(sortedData[2], 2)}
      </View>
      <ScrollView style={{ flex: 1 }}>
      {LEADERBOARD_DATA.map(renderUserItem)}
      </ScrollView>

    </View>
  );
};

// Styles here...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 40,
  },
  topUsers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginTop: 20,
  },
  topUserContainer: {
    alignItems: 'center',
    flex: 1,
  },
  crown: {
    position: 'absolute',
    top: -33,
    zIndex: 1,
    width: 47,
    height: 50,
    resizeMode: 'contain',
  },
  linearGradient: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',

  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  username: {
    fontWeight: 'bold',
  },
  score: {
    color: 'gray',
  },
  trendScore: {
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginHorizontal: 20,
  },
  trendIcon: {
    width: 20,
    height: 20,
  },
  avatarContainer: {
    marginRight: 10,
  },

  // More styles...
});
export default LeaderboardScreen;