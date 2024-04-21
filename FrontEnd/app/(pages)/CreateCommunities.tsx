import axios from "axios";
import React, { useEffect, useState } from "react";
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
  Button,
} from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useLocalSearchParams } from "expo-router";
const CreateCommunity: React.FC = () => {
  const [communityName, setCommunityName] = useState("");
  const [description, setDescription] = useState("");
  const params = useLocalSearchParams();
  const { selectedTags } = params;
  const { url } = useSelector((state: any) => state.user);
  const [tags, setTags] = useState([]);
  const [postFreq, setPostFreq] = useState("");
  const parseTags = (tagsString) => {
    if (!tagsString) return []; // Return an empty array if tagsString is undefined or null
    return tagsString.split(",").map((tag) => {
      const [name, color] = tag.split(" #");
      return { name, color: `#${color}` };
    });
  };
  useEffect(() => {
    const tags = parseTags(selectedTags);
    setTags(tags);
  }, [selectedTags]);

  

  const goNext = () => {
    console.log("postFreq: ", postFreq);

    if (communityName === "") {
      alert("Please enter a community name");
      return;
    } else if (description === "") {
      alert("Please enter a description");
      return;
    } else if (selectedTags.length === 0) {
      alert("Please select at least one tag");
      return;
    } else if (postFreq === "") {
      alert("Please select at least one post day");
      return;
    } else {
      router.push({
        pathname: "/UploadingImages",
        params: {
          communityName,
          description,
          selectedTags,
          postFreq,
        },
      });
    }
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

            <Text style={styles.subtitle}>How many posts do you want to make per week?</Text>
            <View style={styles.numberContainer}>
              <TouchableOpacity
                style={[
                  styles.numberButton,
                  postFreq === "1" && styles.numberButtonSelected,
                ]}
                onPress={() => setPostFreq("1")}
              >
                <Text
                  style={[
                    styles.numberButton,
                    postFreq === "1" && styles.numberButtonSelected,
                  ]}
                >
                  1
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.numberButton,
                  postFreq === "2" && styles.numberButtonSelected,
                ]}
                onPress={() => setPostFreq("2")}
              >
                <Text
                  style={[
                    styles.numberButton,
                    postFreq === "2" && styles.numberButtonSelected,
                  ]}
                >
                  2
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.numberButton,
                  postFreq === "3" && styles.numberButtonSelected,
                ]}
                onPress={() => setPostFreq("3")}
              >
                <Text
                  style={[
                    styles.numberButton,
                    postFreq === "3" && styles.numberButtonSelected,
                  ]}
                >
                  3
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.numberButton,
                  postFreq === "4" && styles.numberButtonSelected,
                ]}
                onPress={() => setPostFreq("4")}
              >
                <Text
                  style={[
                    styles.numberButton,
                    postFreq === "4" && styles.numberButtonSelected,
                  ]}
                >
                  4
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.numberButton,
                  postFreq === "5" && styles.numberButtonSelected,
                ]}
                onPress={() => setPostFreq("5")}
              >
                <Text
                  style={[
                    styles.numberButton,
                    postFreq === "5" && styles.numberButtonSelected,
                  ]}
                >
                  5
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.numberButton,
                  postFreq === "6" && styles.numberButtonSelected,
                ]}
                onPress={() => setPostFreq("6")}
              >
                <Text
                  style={[
                    styles.numberButton,
                    postFreq === "6" && styles.numberButtonSelected,
                  ]}
                >
                  6
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.numberButton,
                  postFreq === "7" && styles.numberButtonSelected,
                ]}
                onPress={() => setPostFreq("7")}
              >
                <Text
                  style={[
                    styles.numberButton,
                    postFreq === "7" && styles.numberButtonSelected,
                  ]}
                >
                  7
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                router.push({
                  pathname: "/SelectTags",
                })
              }
            >
              <Text style={styles.buttonText}> Select Tags</Text>
            </TouchableOpacity>
            {Array.isArray(tags) && tags.length > 0 && (
              <>
                <Text style={styles.subtitle}>Selected Tags:</Text>
                <View style={styles.tagsContainer}>
                  {tags.map((tag) => (
                    <View
                      style={[styles.tag, { backgroundColor: tag.color }]}
                      key={tag.name}
                    >
                      <Text style={styles.tagText}>{tag.name}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            <TouchableOpacity style={styles.button} onPress={goNext}>
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
  numberContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  numberButton: {
    padding: 8,
    margin: 3,
    color: "#ffffff", // Light text color for number buttons
    backgroundColor: "#222", // Darker background for number buttons
    borderRadius: 20,
  },
  numberButtonSelected: {
    backgroundColor: "#5C5CFF", // Highlight color for selected number buttons
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

// we may need this for later
// {availableTags.map((tag) => (
//   <TouchableOpacity
//     key={tag}
//     style={[
//       styles.tag,
//       selectedTags.includes(tag) && styles.tagSelected,
//     ]}
//     onPress={() => toggleTagSelection(tag)}
//   >
//     <Text
//       style={[
//         styles.tagText,
//         selectedTags.includes(tag) && styles.tagTextSelected,
//       ]}
//     >
//       {tag}
//     </Text>
//   </TouchableOpacity>
// ))}