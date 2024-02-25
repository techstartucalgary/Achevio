import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ApiResponse = {
  images: Array<{
    id: string;
    uri: string;
    date: string;
  }>;
};

const groupImagesByDate = (images: ApiResponse['images']) => {
  const grouped = images.reduce((groups, image) => {
    (groups[image.date] = groups[image.date] || []).push(image);
    return groups;
  }, {});

  return Object.keys(grouped).map(date => ({
    title: date,
    data: grouped[date],
  })).sort((a, b) => new Date(b.title).getTime() - new Date(a.title).getTime());
};

const dummyData: ApiResponse = {
  images: [
    { id: '1', uri: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D', date: '2021-03-01' },
    { id: '2', uri: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D' , date: '2021-03-01'},
    { id: '3', uri: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D' , date: '2021-03-01'},
    { id: '4', uri: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D' , date: '2022-03-01'},
    { id: '5', uri: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D'  , date: '2023-03-01'},
    { id: '6', uri: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D'  , date: '2021-03-01'},
    // ... more dummy items
  ],
};
const Collage: React.FC = () => {
  const [data, setData] = useState<ApiResponse>(dummyData);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your API call and endpoint
        const response = await fetch('YOUR_API_ENDPOINT');
        const json: ApiResponse = await response.json();
        if (json.images) {
          setData(json);
        }
      } catch (error) {
        console.error('API call failed:', error);
        // Using dummy data if API call fails
        setData(dummyData);
      }
    };

    fetchData();
  }, []);


  const handleImagePress = (uri: string) => {
    setSelectedImage(uri);
    setIsModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.imageWrapper} onPress={() => handleImagePress(item.uri)}>
      <View style={styles.imageShadow}>
        <Image source={{ uri: item.uri }} style={styles.image} />
      </View>
    </TouchableOpacity>

  );
  const renderSection = ({ section }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
      <FlatList
        data={section.data}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => `image-${item.id}`} // Ensure unique key for each item
        contentContainerStyle={styles.horizontalListContent}
      />
    </View>
  );

return (
  <SafeAreaView style={styles.container}>
    <ScrollView>
      {groupImagesByDate(data.images).map((section) => renderSection({ section }))}
    </ScrollView>
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={styles.modalView}>
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.fullImage} />
        )}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setIsModalVisible(false)}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  </SafeAreaView>
);

};

const numColumns = 3;
const size = Dimensions.get('window').width / numColumns;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey', // Consider a background color that complements your images
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeaderText: {
    fontWeight: '600', // Modern, bold typography
    fontSize: 18,
    marginLeft: 10,
    color: '#333', // Dark color for contrast and readability
  },
  imageShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Now applied to the View, not the Image
  },
  
  horizontalListContent: {
    paddingLeft: 10,
  },
  imageWrapper: {
    borderRadius: 12, // Rounded corners for a modern look
    overflow: 'hidden', // Ensures the Image respects the borderRadius
    marginRight: 10,
  },
  image: {
    width: size,
    height: size,
    resizeMode: 'cover', // Ensures the images cover the area without stretching
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent background
  },
  fullImage: {
    width: '90%', // Adjust as needed
    height: '80%', // Adjust as needed
    resizeMode: 'contain', // Ensure the image fits within the modal without stretching
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#FFF', // A contrasting color for the button
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#000', // Text color that contrasts with the button background
    fontSize: 16,
  },
});

export default Collage;