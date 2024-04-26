import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import axios from "axios";

// Images path should be replaced with the actual paths to your assets
const IMAGES = {
  Earth: require("../../assets/images/earth.jpeg"),
  Mars: require("../../assets/images/mars.jpeg"),
  Jupiter: require("../../assets/images/jupiter.jpeg"),
  crown: require("../../assets/images/crown.jpg"),
  userAvatar: require("../../assets/images/dummyuser.png"),
};
const LEADERBOARD_DATA = [
  { id: "1", username: "Matthew", score: 1847, planet: "earth" },
  { id: "2", username: "Jacob", score: 3056, planet: "mars" },
  { id: "3", username: "Ruben", score: 1674, planet: "jupiter" },
  { id: "4", username: "John", score: 1245, planet: "earth" },
  { id: "5", username: "Jane", score: 2356, planet: "mars" },
  { id: "6", username: "Alice", score: 3456, planet: "jupiter" },
  { id: "7", username: "Bob", score: 2356, planet: "earth" },
  { id: "8", username: "Charlie", score: 3456, planet: "mars" },
  { id: "9", username: "David", score: 2356, planet: "jupiter" },
  { id: "10", username: "Eve", score: 3456, planet: "earth" },
  { id: "11", username: "Frank", score: 2356, planet: "mars" },
  { id: "12", username: "Grace", score: 3456, planet: "jupiter" },
  { id: "13", username: "Hannah", score: 2356, planet: "earth" },
  { id: "14", username: "Isaac", score: 3456, planet: "mars" },
  { id: "15", username: "Jack", score: 2356, planet: "jupiter" },
  { id: "16", username: "Kelly", score: 3450, planet: "earth" },
  { id: "17", username: "Liam", score: 2356, planet: "mars" },
  { id: "18", username: "Mia", score: 3456, planet: "jupiter" },
  { id: "19", username: "Nathan", score: 2356, planet: "earth" },
  { id: "20", username: "Olivia", score: 3456, planet: "mars" },

  // ... additional users
];

const LeaderboardScreen = () => {
  const [selectedPlanet, setSelectedPlanet] = useState("earth");
  const {url} = useSelector((state: any) => state.user);
  const params = useLocalSearchParams();
  const communityId = params.communityId;
  const [LEADERBOARD_DATA, setLeaderboardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [topThreeUsers, setTopThreeUsers] = useState([])
  const [otherUsers, setOtherUsers] = useState([])

  const planetTabs = ["Earth", "Mars", "Jupiter"];

  
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const res = await axios.get(`${url}/community/${communityId}/leaderboard`);
          if (res.status === 200) {
            const data = res.data;
            console.log("Leaderboard Data: ", data);
            const filteredData = data.filter(user => user.planet.toLowerCase() === selectedPlanet.toLowerCase()).sort((a, b) => b.score - a.score);
            console.log("Filtered Data: ", filteredData);
            const topUsers = filteredData.slice(0, 3);
            console.log("Top Users: ", topUsers);
            const otherUsers = filteredData.slice(3);
            console.log("Other Users: ", otherUsers);
            setLeaderboardData(data);
            setFilteredData(filteredData);
            setTopUsers(topUsers);
            setTopThreeUsers([
              topUsers[1], // Second highest score
              topUsers[0], // Highest score
              topUsers[2]  // Third highest score
            ]);
            setOtherUsers(otherUsers);
          }
        } catch (error) {
          console.error("Failed to fetch leaderboard data", error);
        }
      };
      fetchData();
    }, [url, communityId, selectedPlanet]) // Add selectedPlanet to ensure updates when it changes
  );
  
  

  const renderTopUser = (user, index) => {
    const userStyles = [styles.userLeft, styles.userMiddle, styles.userRight];
    console.log("User: ", user);

    return (
      <View key={user?.id} style={[styles.topUserContainer, userStyles[index]]}>
        <View style={[styles.userAvatarBorder, index === 1 ? styles.userAvatarBorderFirst :null, index === 0 ? {borderColor: "silver"} : null]}>
          <Image source={require('../../assets/images/dummyuser.png')} style={styles.userAvatar} />
          {index === 1 && <Image source={require('../../assets/images/crown.png')} style={styles.crownIcon} />}
        </View>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={[styles.score,  index === 1 ? {color: "#FFD700"} : null, index === 0? {color: "silver"} : null, index === 2? {color: "#cd7f32"} : null]}>{user?.score}</Text>
      </View>
    );
  }; 

  const renderUserItem = ({ item }) => {
    return (
      <View style={styles.userItem}>
        <Image source={IMAGES.userAvatar} style={styles.userAvatarSmall} />
        <Text style={styles.usernameSmall}>{item.username}</Text>
        <Text style={styles.scoreSmall}>{item.score}</Text>
      </View>
    );
  };


  return (
    console.log(topThreeUsers),
    <View style={styles.container}>
      {
        LEADERBOARD_DATA.length <=2 ? (
          <>
          <Text style={styles.header}>Leaderboard</Text>
          <Text style={styles.header}>Add at least 3 users to see the leaderboard</Text>
          </>
        ) : (
          <>
<Text style={styles.headerText}>Leaderboard</Text>
      <View style={styles.planetTabsContainer}>
        {planetTabs.map((planet) => (
          <TouchableOpacity
            key={planet}
            onPress={() => setSelectedPlanet(planet)}
            style={styles.planetTab}
          >
<Image 
  source={IMAGES[planet]} 
  style={[
    styles.planetIcon, 
    { tintColor: selectedPlanet === planet ? undefined : "#grey" } // Apply grey tint color when not selected
  ]} 
/>
            <Text style={styles.planetName}>{planet.charAt(0).toUpperCase() + planet.slice(1)}</Text>
            {selectedPlanet === planet && <View style={styles.indicatorBar} />}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.topUsersContainer}>
        {topThreeUsers.map(renderTopUser)}
      </View>

      <FlatList
        data={otherUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        style={styles.fullList}
      />
      </>
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Full black background as per the screenshot
  },
  topUserContainer: {
    width: '33.333%', // Divide the container into three equal parts
    justifyContent: "flex-start",
    alignItems: "center",
    height: '100%',
  },
  planetTab: {
    alignItems: 'center',
  },
  planetName: {
    color: "#fff",
    textAlign: "center",
    paddingTop: 5,
  },
  indicatorBar: {
    height: 2,
    width: '100%',
    backgroundColor: '#fff',
    marginTop: 2,
  },
  userAvatarBorder: {
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    backgroundColor: "#000", // Assuming black border for avatars
    position: "relative",
    bottom: 50, // Adjust based on your design
    borderColor: "#cd7f32"

  },
  userAvatarBorderFirst: {
    borderColor: "#FFD700", // Gold border for the first user
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  crownIcon: {
    position: "absolute",
    top: -39, // Adjust accordingly
    width: 50,
    height: 50,
  },
  avatar: {
    borderRadius: 50,
    width: 100,
    height: 100,
  },
  linearGradient: {
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width:200
  },
  userLeft: {
    backgroundColor: "#3f3f3f",
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    marginLeft: 10, // Adjust based on your design
    height: 120, // Smaller height for second and third places
    justifyContent: 'flex-end', // Align the content to the bottom for left and right
  },
  userMiddle: {
    backgroundColor: "#6a6a6a",
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    zIndex: 2, // Ensure it overlaps the other two users
    height: 180,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowColor: "#000",
    shadowOffset: { height: 3, width: 0 },
    elevation: 4,
  },
  userRight: {
    backgroundColor: "#3f3f3f",
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    height: 120,
    marginRight: 10, // Adjust based on your design
    justifyContent: 'flex-end',
  },
  username: {
    fontSize: 16,
    color: "#fff",
    marginTop: 8,
    position: "relative",
    bottom: 30, // Adjust based on your design
  },
  score: {
    fontSize: 14,
    color: "#fff",
    position: "relative",
    fontWeight: "bold",
    bottom: 30, // Adjust based on your design
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 50,
  },
  planetTabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1d2238", // Full black background as per the screenshot
    padding: 20,
    margin: 20,
    borderRadius: 20,

  },
  planetIcon: {
    width: 50,
    height: 50,
    borderRadius: 25, // Optional: if you want rounded icons
    borderWidth: 2, // Optional: border to highlight when selected
    borderColor: 'transparent', // Initial borderColor, overridden by inline style
  },  

  topUsersContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: 120,
    height: 120, // Define the height for the container
  },
  

  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 50,
  },
  fullList: {
    marginTop: 20,
    backgroundColor: "#333", // Slightly lighter black for list background
    padding: 10,
    borderRadius: 20,
  },
  crown: {
    position: "absolute",
    top: -25, // Adjust based on your design
    width: 50,
    height: 50,
  },

  avatarBorder: {
    borderWidth: 3,
    borderColor: "transparent",
    borderRadius: 50,
    padding: 5,
  },
  firstPlace: {
    borderColor: "#FFD700", // Gold color for the 1st place
  },
  
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "grey", // Slightly lighter black for list separator
  },
  userAvatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  usernameSmall: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  scoreSmall: {
    color: "#fff",
    fontSize: 16,
  },
  // ... any other styles you need
});

export default LeaderboardScreen;
