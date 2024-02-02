// SelectCommunities.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import {router, useLocalSearchParams} from "expo-router";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

interface Community {
  id: string;
  name: string;
}


const SelectCommunities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useLocalSearchParams();
  const photoUri = params.photoUri;
  const caption = params.caption;
  const title = params.title;
  const { url, username} = useSelector((state: any) => state.user);
  const dispatch = useDispatch();


  useEffect(() => {
    const res = axios.get(`${url}/user/myCommunities`)
    .then(response => {
      setCommunities(response.data);
    })
    .catch(error => console.error('Error fetching communities:', error));
    console.log(res);
    
      
  }, []);

  const handleSelectCommunity = (id: string) => {
    setSelectedCommunities(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('file', {
        uri: photoUri,
        name: 'image.jpg',
        type: 'image/jpg',
      } as any);
    formData.append('title', title as string);
    formData.append('caption', caption as string);
    formData.append('communities_id', selectedCommunities.join(',') as string);

    axios.post(`${url}/user/post`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => console.log('Response:', response.data))
    .catch(error => console.error('Error uploading image:', error))
    .finally(() => setIsSubmitting(false));
  };

  const renderItem = ({ item }: { item: Community }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelectCommunity(item.id)}>
      <Text style={styles.text}>{item.name}</Text>
      {selectedCommunities.includes(item.id) && <FontAwesome name="check" size={20} color="green" />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={communities}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting} style={styles.submitButton}>
        {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit Post</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    padding: 10,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  text: {
    flex: 1,
    fontSize: 18,
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 20,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
  },

});

export default SelectCommunities;
