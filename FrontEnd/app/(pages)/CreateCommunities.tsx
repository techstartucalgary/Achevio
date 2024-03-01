import axios from "axios";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";


// Dummy data for tags and days
const availableTags = [
  "Sports",
  "Music",
  "Technology",
  "Gaming",
  "News",
  "Health",
];
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const CreateCommunity: React.FC = () => {
  const [communityName, setCommunityName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [postDays, setPostDays] = useState<string[]>([]);
  const { url } = useSelector((state: any) => state.user);
  const toggleTagSelection = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const toggleDaySelection = (day: string) => {
    setPostDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Create a New Community</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="people" size={24} color="#5C5CFF" />
              <TextInput
                value={communityName}
                onChangeText={setCommunityName}
                placeholder="Community Name"
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="#5C5CFF"
              />
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Description"
                style={[styles.input, styles.textArea]}
                multiline
              />
            </View>

            <Text style={styles.subtitle}>Select Tags:</Text>
            <View style={styles.tagsContainer}>
              {availableTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tag,
                    selectedTags.includes(tag) && styles.tagSelected,
                  ]}
                  onPress={() => toggleTagSelection(tag)}
                >
                  <Text
                    style={[
                      styles.tagText,
                      selectedTags.includes(tag) && styles.tagTextSelected,
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.subtitle}>Post Days:</Text>
            <View style={styles.daysContainer}>
              {daysOfWeek.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    postDays.includes(day) && styles.daySelected,
                  ]}
                  onPress={() => toggleDaySelection(day)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      postDays.includes(day) && styles.dayTextSelected,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                router.push({
                  pathname: "/UploadingImages",
                  params: {
                    communityName,
                    description,
                    selectedTags,
                    postDays,
                  },
                })
              }
            >
              <Text style={styles.buttonText}>Create Community</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background color
  },
  keyboardView: {
    flex: 1,
  },
  formContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ffffff", // Light text for better contrast on dark background
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#333", // Darker border color for inputs
    padding: 10,
    borderRadius: 8,
    margin: 5,
    color: "#ffffff", // Light text color
    backgroundColor: "#222", // Slightly lighter input background for contrast
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 5,
    marginBottom: 5,
    fontWeight: "bold",
    color: "#ffffff", // Light text for labels
  },
  button: {
    backgroundColor: "#5C5CFF", // You can adjust the button color as needed
    padding: 15,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff", // Text color remains light for contrast
    fontWeight: "bold",
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  tag: {
    borderWidth: 1,
    borderColor: "#5C5CFF", // Adjust if necessary to fit your theme
    borderRadius: 20,
    padding: 8,
    margin: 4,
    backgroundColor: "#222", // Darker tag background for unselected tags
  },
  tagSelected: {
    backgroundColor: "#5C5CFF", // Highlight color for selected tags
  },
  tagText: {
    color: "#ffffff", // Light text color for better readability
  },
  tagTextSelected: {
    color: "#fff", // Ensuring contrast remains high for selected tags
  },
  scrollView: {
    width: "100%",
  },
  subtitle: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#ffffff", // Light text color for subtitles
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  dayButton: {
    borderWidth: 1,
    borderColor: "#5C5CFF", // Button border color
    borderRadius: 20,
    padding: 8,
    margin: 4,
    backgroundColor: "#222", // Darker background for day buttons
  },
  daySelected: {
    backgroundColor: "#5C5CFF", // Highlight color for selected days
  },
  dayText: {
    color: "#ffffff", // Light text color
  },
  dayTextSelected: {
    color: "#fff", // Ensuring readability for selected days
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333", // Darker border color
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    width: "100%",
    backgroundColor: "#222", // Slightly lighter background for contrast
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
    color: "#ffffff", // Light text color for text area
    backgroundColor: "#222", // Dark background for text area
  },
});
export default CreateCommunity;
