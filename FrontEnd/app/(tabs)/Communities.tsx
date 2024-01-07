import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { getDayOfYear, getISODay } from 'date-fns';
import { router } from 'expo-router';
import uuid from 'react-native-uuid';
// Constants
const windowWidth = Dimensions.get('window').width;
const DATE_ITEM_WIDTH = windowWidth / 5; // Display 5 items at a time

// Generate dates data with dynamic range
const generateDatesData = () => {
  // Get the current day of the year
  const today = new Date();
  const currentDayOfYear = getDayOfYear(today);
  const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i - 3);
    return {
      key: String(currentDayOfYear + i - 3),
      day: daysInWeek[date.getDay()],
      date: date.getDate(),
      isToday: i === 3 // If the index is 3, it is the current day
    };
  });
};

const datesData = generateDatesData();
const todayIndex = datesData.findIndex(item => item.isToday);

const postData = Array.from({ length: 10 }, (_, index) => ({
  key: String(index),
  imageUri: 'https://via.placeholder.com/150'
}));

const communitiesData = Array.from({ length: 10 }, (_, index) => ({
  key: String(index),
  title: `Community ${index + 1}`,
  streak: `${index + 4} day streak!`
}));

const Communities = () => {
  const flatListRef = useRef(null);

  useEffect(() => {
    // Check if today's index is valid and scroll to it
    if (flatListRef.current && todayIndex !== -1) {
      // Calculate the offset to center the item
      const offset = (todayIndex * DATE_ITEM_WIDTH) - (windowWidth / 2) + (DATE_ITEM_WIDTH / 2);
      flatListRef.current.scrollToOffset({ offset, animated: true });
    }
  }, [todayIndex]);

  const renderDateItem = ({ item, index }) => {
    const isToday = index === todayIndex;
    return (
      <View style={[styles.dateItem, isToday ? styles.highlight : null]}>
        <Text style={styles.dateDay}>{item.day}</Text>
        <Text style={styles.dateNumber}>{item.date}</Text>
      </View>
    );
  };
  // Component for rendering post items
  const renderPostItem = ({ item }) => (
    <Image source={{ uri: item.imageUri }} style={styles.postImage} />
  );
  const id = uuid.v4();
  // Component for rendering community items
  const renderCommunityItem = ({ item }) => (
    
    <TouchableOpacity
      style={styles.communityItem}
      onPress={() => {
        console.log(`/(pages)/CommunitiesPage`);

        router.push({
          pathname: '/(pages)/CommunitiesPage', // The route name
          params: { communityId: id }, // Parameters as an object
        });
      }
    }
    >
      <Text style={styles.communityTitle}>{item.title}</Text>
      <Text style={styles.communityStreak}>{item.streak}</Text>
    </TouchableOpacity>
  );
  // Header component to be rendered above the communities list
  const ListHeader = () => (
    <>
      <FlatList
        ref={flatListRef}
        horizontal
        data={datesData}
        renderItem={renderDateItem}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        style={styles.datesList}
        initialScrollIndex={todayIndex}
        getItemLayout={(data, index) => ({
          length: DATE_ITEM_WIDTH,
          offset: DATE_ITEM_WIDTH * index,
          index,
        })}
      />
      <Text style={styles.sectionTitle}>What you missed</Text>
      <FlatList
        horizontal
        data={postData}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        style={styles.postsList}
      />
    </>
  );

  return (
    <FlatList
      ListHeaderComponent={ListHeader}
      data={communitiesData}
      renderItem={renderCommunityItem}
      keyExtractor={(item) => item.key}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    backgroundColor: '#000', // Set your background color
  },
  datesList: {
    flexGrow: 0, // Ensure the FlatList does not expand
  },
  dateItem: {
    width: DATE_ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  highlight: {
    backgroundColor: 'orange', // Your highlight color
  },
  dateDay: {
    color: '#fff',
    fontSize: 16,
  },
  dateNumber: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
  },
  postsList: {
    flexGrow: 0, // Ensure the FlatList does not expand
    paddingLeft: 10,
  },
  postImage: {
    width: 120, // Set your desired size
    height: 120,
    borderRadius: 10, // if you want rounded corners
    marginRight: 10,
  },
  communityItem: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 10, // if you want rounded corners
  },
  communityTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  communityStreak: {
    color: '#fff',
    marginTop: 4,
  },
});

export default Communities;
