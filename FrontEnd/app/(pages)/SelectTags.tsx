import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {router} from 'expo-router';

interface Tag {
  name: string;
  color: string;
}

export default function SelectTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const { url } = useSelector((state: any) => state.user);
  const navigation = useNavigation();

  useEffect(() => {
    const options = {
      method: 'GET',
      url: `${url}/tag`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: ''
      },
    };
    async function fetchData() {
      try {
        const { data } = await axios.request(options);
        setTags(data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch tags');
      }
    }
    fetchData();
  }, []);

const handleSelectTag = (selectedTag: Tag) => {
    if (selectedTags.some(tag => tag.name === selectedTag.name)) {
        setSelectedTags(selectedTags.filter(tag => tag.name !== selectedTag.name)); // Remove tag from selection
    } else {
        setSelectedTags([...selectedTags, selectedTag]); // Add tag to selection
    }
};

const navigateToCommunity = () => {
    const selectedTagNames = selectedTags.map(tag => tag.name + " " + tag.color); // Map selectedTags array to an array of tag names
    router.push({
            pathname: "/(pages)/CreateCommunities", 
            params: { selectedTags: selectedTagNames } // Assign the array of tag names to selectedTags
    });
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Tags:</Text>
      <FlatList
        data={tags}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.tagItem, { backgroundColor: selectedTags.includes(item) ? '#4CAF50' : item.color }]}
            onPress={() => handleSelectTag(item)}
          >
            <Text style={styles.tagText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.name}
      />
      <TouchableOpacity onPress={navigateToCommunity} style={styles.button}>
        <Text style={styles.buttonText}>Go to Community</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tagItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: 300,
    alignItems: 'center',
  },
  tagText: {
    color: 'white',
    fontSize: 18,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#0066cc',
    padding: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  selectedTag: {
    fontSize: 18,
    color: 'navy',
  }
});