import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';

type User = {
  id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  last_login?: string;
  communities?: Array<{
    user_id: string;
    community_id: string;
    role: string;
  }>;
};

const AddFriendsPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Users..."
        placeholderTextColor="#999"
        value={searchText}
        onChangeText={handleSearch}
      />
      <FlatList
        data={searchText ? filteredUsers : users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.username}>{item.username}</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => addFriend(item.id)}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    marginTop: 30,
  },
  searchInput: {
    backgroundColor: '#333',
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  username: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#5C5CFF',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddFriendsPage;
