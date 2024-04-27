import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Animated,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { ScreenHeight, ScreenWidth } from "react-native-elements/dist/helpers";
import LottieView from "lottie-react-native";

const categories = {
  Sports: [
    "Running",
    "Swimming",
    "Cycling",
    "Soccer",
    "Basketball",
    "Golf",
    "Surfing",
    "Skateboarding",
  ],
  Music: ["Guitar", "Piano", "Singing", "Dancing", "Violin"],
  Art: ["Drawing", "Painting", "Sculpting"],
  Lifestyle: [
    "Cooking",
    "Hiking",
    "Reading",
    "Baking",
    "Sewing",
    "Studying",
    "Gardening",
    "Meditation",
    "Yoga",
    "Photography",
  ],
};

interface Tag {
  name: string;
  color: string;
  category?: string;
}

export default function pickInterest() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const { url } = useSelector((state: any) => state.user);
  const fadeAnim = new Animated.Value(0);
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();



    const fetchTags = async () => {
      try {
        const response = await axios.get(`${url}/tag`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        const categorizedTags = response.data.map((tag) => ({
          ...tag,
          category: Object.keys(categories).find((key) =>
            categories[key].includes(tag.name)
          ),
        }));
        setTags(categorizedTags);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to fetch tags");
      }
    };
    fetchTags();
  }, []);

  const handleSelectTag = (selectedTag: Tag) => {
    setSelectedTags((prev) =>
      prev.some((tag) => tag.name === selectedTag.name)
        ? prev.filter((tag) => tag.name !== selectedTag.name)
        : [...prev, selectedTag]
    );
  };

  const renderTagItem = ({ item }) => {
    const isSelected = selectedTags.some((tag) => tag.name === item.name);
    return (
      <TouchableOpacity
        style={[
          styles.tagItem,
          isSelected
            ? { backgroundColor: item.color }
            : styles.tagItemNotSelected,
        ]}
        onPress={() => handleSelectTag(item)}
      >
        <Text
          style={[
            styles.tagText,
            isSelected ? { color: "white" } : { color: "black" },
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCategory = ({ item }) => {
    const categoryTags = tags.filter((tag) => tag.category === item);
    return (
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{item}</Text>
        <FlatList
          data={categoryTags}
          renderItem={renderTagItem}
          keyExtractor={(item) => item.name}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };
  const onButtonPress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
        router.push("/(Tutorial)/AddFriendsPage")
    });
  };
  return (
    <View style={[styles.container]}>
      <LottieView
            source={require("../../assets/background_space.json")}
            autoPlay
            loop
            style={{
              position: "absolute", // Set position to absolute
              width: ScreenWidth, // Cover the entire width
              height: ScreenHeight, // Cover the entire height
              zIndex: 1, // Ensure it stays behind other components
            }}
          />
      <Text style={styles.title}>Select Your Interests</Text>
      <FlatList
        data={Object.keys(categories)}
        renderItem={renderCategory}
        keyExtractor={(item) => item}
      />
      <View style={{ flex: 1}}>
       <TouchableOpacity onPress={onButtonPress}>
      <Animated.View style={{ backgroundColor: '#4CAF50', padding: 15, width: ScreenWidth-20, left: 10, height: 60, borderRadius: 25, position:"relative", top:20}}>
        <Text style={styles.buttonText}>Next</Text>
      </Animated.View>
    </TouchableOpacity>
    </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    height:ScreenHeight,
    width:ScreenWidth,
    backgroundColor: "#282c34", // Dark space theme background color
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
    textAlign: "center",
  },
  categoryContainer: {
    marginBottom: 30,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#DDD",
    marginBottom: 15,
    paddingLeft: 10,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  tagItem: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    margin: 5,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Other styles...
  },
  tagItemNotSelected: {
    backgroundColor: "#d3d3d3",
  },
  tagItemSelected: {
    backgroundColor: "#4CAF50", // Selection color
  },
  tagText: {
    color: "white",
    fontSize: 16,
  },
  tagTextSelected: {
    color: "black", // Text color when item is selected
  },
});
