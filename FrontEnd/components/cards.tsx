import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CustomCard = ({ selectedPlayer, setSelectedPlayer }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{selectedPlayer.name}</Text>
      <View style={styles.divider} />
      <View style={styles.content}>
        <Text style={styles.achievementText}>Achievements</Text>
        {selectedPlayer.achievements.map((achievement, index) => (
          <Text key={index} style={styles.achievementText}>{achievement}</Text>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={() => setSelectedPlayer(null)}>
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    padding: 16,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    borderBottomColor: '#E1E1E1',
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  content: {
    marginBottom: 16,
  },
  achievementText: {
    fontSize: 16,
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 4,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomCard;
