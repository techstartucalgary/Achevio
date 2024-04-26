import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useLocalSearchParams } from 'expo-router';

const FadeInView = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{ ...props.style, opacity: fadeAnim }}>
      {props.children}
    </Animated.View>
  );
};

const CommunityStatus = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { url } = useSelector((state: any) => state.user);
  const params = useLocalSearchParams();
  const communityId = params.communityId;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${url}/community/${communityId}/requests`);
        setRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch community requests:", error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, [url, communityId]);

  const acceptRequest = async (userId, username) => {
    try {
      const response = await axios.post(`${url}/community/${communityId}/accept/${userId}`);
      if (response.status === 201) {
        alert(`Accepted ${username} into the community.`);
        setRequests(prevRequests => prevRequests.filter(request => request.id !== userId));
      } else {
        alert('Failed to accept the request');
      }
    } catch (error) {
      console.error("Failed to accept request:", error);
      alert('Error accepting request');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1e90ff" />
      </View>
    );
  }

  if (requests.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No Pending Requests</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community Requests</Text>
      <View style={styles.statusContainer}>
        {requests.map((request) => (
          <FadeInView key={request.id} style={styles.statusCard}>
            <Text style={styles.statusText}>{request.username}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => acceptRequest(request.id, request.username)}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
          </FadeInView>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    marginTop: 30,
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',  // Center the loading indicator or message
    justifyContent: 'flex-start',  // Center the loading indicator or message
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  statusCard: {
    flexDirection: 'row',
    marginRight: 20,
    width: 200, // Adjust the width to fit the content
    height: 80, // Adjust the height to fit the content
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#252525', // Slightly lighter than the container for contrast
    borderRadius: 5,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  statusText: {
    fontSize: 16,
    color: '#BDBDBD',
    marginRight: 10,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#1e90ff',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});

export default CommunityStatus;
