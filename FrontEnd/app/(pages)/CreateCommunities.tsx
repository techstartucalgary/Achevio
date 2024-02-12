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

  const handleCreateCommunity = async () => {
    console.log("Community Name:", communityName);
    console.log("Description:", description);
    console.log("Selected Tags:", selectedTags);
    console.log("Post Days:", postDays);

    // Transform postDays and selectedTags into arrays of objects
    const postDaysPayload = postDays.map((day) => ({ day }));
    const tagsPayload = selectedTags.map((name) => ({ name }));

    try {
      const res = await axios.post(`${url}/user/community`, {
        name: communityName,
        description,
        postdays: postDaysPayload, // Send as an array of objects
        tags: tagsPayload, // Send as an array of objects
      });
      console.log("Response:", res);

      if (res.status === 201) {
        console.log("Community created successfully:", res.data);
        router.push("/(tabs)/Communities");
      }
    } catch (error) {
      console.error("Error creating community:", error);
    }
  };

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
              <Ionicons name="people" size={24} color="#007bff" />
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
                color="#007bff"
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
              onPress={handleCreateCommunity}
            >
              <Text style={styles.buttonText}>Create Community</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    margin: 5,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 5,
    marginBottom: 5,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
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
    borderColor: "#007bff",
    borderRadius: 20,
    padding: 8,
    margin: 4,
  },
  tagSelected: {
    backgroundColor: "#007bff",
  },
  tagText: {
    color: "#000",
    fontSize: 14,
  },
  tagTextSelected: {
    color: "#fff",
  },
  scrollView: {
    width: "100%",
  },
  subtitle: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
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
    borderColor: "#007bff",
    borderRadius: 20,
    padding: 8,
    margin: 4,
  },
  daySelected: {
    backgroundColor: "#007bff",
  },
  dayText: {
    color: "#000",
    fontSize: 14,
  },
  dayTextSelected: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    width: "100%",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
});
export default CreateCommunity;
