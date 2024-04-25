import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';

// Assuming User type has at least an id and username
interface User {
  id: string;
  username: string;
}

const AddFriendsPage = () => {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const { url } = useSelector((state: any) => state.user);

  const fetchMe = async () => {
    try {
      const response = await axios.get(`${url}/user/me`);
      return response.data.id;
    } catch (error) {
      console.error('Error fetching user info:', error);
      Alert.alert('Error', 'Unable to fetch your user information.');
      return null;
    }
  };

  const fetchUsersAndFriends = async () => {
    try {
      const userId = await fetchMe();
      const [usersResponse, friendsResponse] = await Promise.all([
        axios.get(`${url}/user`),
        axios.post(`${url}/user/friends`),
      ]);
      const allUsers = usersResponse.data.filter((user: User) => user.id !== userId);
      const friendIds: string[] = friendsResponse.data.map((friend: User) => friend.id);
      setFriends([...friendIds]);
      setUsers(allUsers.filter((user: User) => !friendIds.includes(user.id)));
    } catch (error) {
      console.error('Error fetching users or friends:', error);
      Alert.alert('Error', 'Unable to fetch users or friends.');
    }
  };

  useEffect(() => {
    fetchUsersAndFriends();
  }, []);

  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
    const lowercasedFilter = text.toLowerCase();
    const filteredData = users.filter((item) =>
      item.username.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredUsers(filteredData);
  }, [users]);

  const addFriend = async (friendId: string) => {
    try {
      await axios.post(`${url}/user/friend/${friendId}`);
      Alert.alert('Success', 'Friend added successfully.');
      fetchUsersAndFriends(); // Refresh the list to reflect the changes
    } catch (error) {
      console.error('Error adding friend:', error);
      Alert.alert('Error', 'Unable to add friend.');
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userContainer}>
      <Text style={styles.username}>{item.username}</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => addFriend(item.id)}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Add Friends</Text>
      <Text style={styles.descriptionText}>
        Connect with friends to see what they are up to and share your experiences.
      </Text>
      <TextInput
        style={styles.searchInput}
        onChangeText={handleSearch}
        value={searchText}
        placeholder="Search by name or username"
        placeholderTextColor="#666"
      />
      <FlatList
        data={searchText ? filteredUsers : users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        style={styles.usersList}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 25,
    backgroundColor: '#000', // Dark theme background color
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  username: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#1E90FF',
    padding: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  usersList: {
    width: '100%',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchInput: {
    height: 50,
    width: '100%',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    color: '#fff', // Text color for dark theme
    marginBottom: 20,
  },
  
  skipButton: {
    paddingVertical: 15,
    width: '100%',
    borderRadius: 25,
  },
  skipButtonText: {
    color: '#aaa', // Subtle color for skip action
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default AddFriendsPage;
