import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { ListItem, Avatar, ButtonGroup } from 'react-native-elements';
import { BarChart } from 'react-native-chart-kit';
import { FontAwesome } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const data = {
  labels: ["Player One", "Player Two", "Player Three"],
  datasets: [
    {
      data: [500, 400, 300]
    }
  ]
};

const chartConfig = {
  backgroundGradientFrom: "#282c34", // Darker background
  backgroundGradientTo: "#282c34", // Consistent with from color for a solid look
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White color for text
  barRadius: 5,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  fillShadowGradient: `rgba(255, 255, 255, 1)`, // White gradient for bars
  fillShadowGradientOpacity: 1,
  decimalPlaces: 0,
  animationDuration: 500,
  propsForBackgroundLines: {
    strokeDasharray: '', // Solid lines
    stroke: 'rgba(255, 255, 255, 0.2)', // Lighter lines for contrast
  },
  propsForLabels: {
    fontFamily: 'YourCustomFont-Family',
    fill: 'rgba(255, 255, 255, 0.87)', // White color for labels with high opacity
  },
};
const players = [
  { id: '1', name: 'Player One', score: 500, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: '2', name: 'Player Two', score: 400, avatar: 'https://randomuser.me/api/portraits/women/32.jpg' },
  { id: '3', name: 'Player Three', score: 300, avatar: 'https://randomuser.me/api/portraits/men/33.jpg' },
];

const LeaderboardScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const updateIndex = (index) => {
    setSelectedIndex(index);
  }

  const buttonGroupButtons = ['Overall', 'Monthly', 'Weekly'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Leaderboard</Text>
        <ButtonGroup
          onPress={updateIndex}
          selectedIndex={selectedIndex}
          buttons={buttonGroupButtons}
          containerStyle={styles.buttonGroupContainer}
          selectedButtonStyle={styles.selectedButtonStyle}
          textStyle={styles.buttonGroupText}
          innerBorderStyle={{ width: 0 }}
        />
      </View>
      <BarChart
        style={styles.chart}
        data={data}
        width={screenWidth - 30}
        height={220}
        yAxisLabel=""
        yAxisSuffix=''
        chartConfig={chartConfig}
        verticalLabelRotation={30}
      />
      {players.map((player, index) => (
        <ListItem key={player.id} bottomDivider containerStyle={styles.listItem}>
          <Avatar source={{ uri: player.avatar }} rounded size="medium" />
          <ListItem.Content>
            <ListItem.Title style={styles.listItemTitle}>{player.name}</ListItem.Title>
            <ListItem.Subtitle>{`Score: ${player.score}`}</ListItem.Subtitle>
          </ListItem.Content>
          <FontAwesome name="trophy" size={24} color="#FFD700" />
        </ListItem>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    backgroundColor: '#121212', // Dark background
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff', // White color for text
    paddingBottom: 10,
    textAlign: 'center',
  },
  buttonGroupContainer: {
    height: 40,
    borderColor: '#303030', // Adjusted border color for dark theme
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#282c34', // Ensure the background color is set for the container
  },
  selectedButtonStyle: {
    backgroundColor: '#1a73e8', // A brighter color for selected state for contrast
  },
  buttonGroupText: {
    color: '#ffffff', // White text for better readability
  },

  listItem: {
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: '#1f1f1f', // Darker background for list items
    shadowColor: "#ffffff", // Shadow color adjusted for dark theme
    // Rest of the shadow properties can remain the same if you prefer a shadow effect
  },
  listItemTitle: {
    fontWeight: 'bold',
    color: '#ffffff', // Ensuring text is visible against the dark backgrounds
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
    padding: 10,
  },
  header: {
    marginBottom: 20,
  },
  // Include other necessary style adjustments for the dark theme here
});
export default LeaderboardScreen;
