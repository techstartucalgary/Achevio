import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

type TagProps = {
  text: string;
  selected: boolean;
  onSelect: () => void;
};

const Tag: React.FC<TagProps> = ({ text, selected, onSelect }) => (
  <TouchableOpacity
    style={[styles.tag, selected && styles.tagSelected]}
    onPress={onSelect}
  >
    <Text style={[styles.tagText, selected && styles.tagTextSelected]}>
      {text}
    </Text>
  </TouchableOpacity>
);

type RadioButtonProps = {
  label: string;
  value: string;
  onPress: () => void;
  selectedValue: string;
};

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  value,
  onPress,
  selectedValue,
}) => (
  <TouchableOpacity style={styles.radioButtonContainer} onPress={onPress}>
    <View
      style={[
        styles.outerCircle,
        selectedValue === value && styles.selectedOuterCircle,
      ]}
    >
      {selectedValue === value && <View style={styles.innerCircle} />}
    </View>
    <Text style={styles.radioButtonLabel}>{label}</Text>
  </TouchableOpacity>
);

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>("");
  const [isFiltersVisible, setIsFiltersVisible] = useState<boolean>(true); // State to manage filter visibility

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const tags = [
    "Creativity",
    "Creepy",
    "Cramming",
    "Craft",
    "Car",
    "Colour",
    "Celebrate",
    "Cat",
    "Cookie",
  ];

  // Function to handle the selection of sort options
  const handleSortOptionChange = (option: string) => {
    setSortOption((prev) => (prev === option ? "" : option));
  };

  // Function to toggle filter visibility
  const toggleFiltersVisibility = () => {
    setIsFiltersVisible((prev) => !prev);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#000" />
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <MaterialIcons
            name="close"
            size={20}
            color="#000"
            style={styles.closeIcon}
            onPress={() => setSearchQuery("")}
          />
        )}
        <TouchableOpacity onPress={toggleFiltersVisibility}>
          <Ionicons name="options" size={20} color="#000" />
        </TouchableOpacity>
      </View>
      {isFiltersVisible && (
        <ScrollView style={styles.scrollView}>
          <Text style={styles.filtersTitle}>Filters</Text>
          <View style={styles.tagsContainer}>
            {tags.map((tag) => (
              <Tag
                key={tag}
                text={tag}
                selected={selectedTags.includes(tag)}
                onSelect={() => toggleTag(tag)}
              />
            ))}
          </View>
          <Text style={styles.sortTitle}>Sort By:</Text>
          {[
            "Community name",
            "Community tags",
            "Communities my friends are in",
          ].map((option) => (
            <RadioButton
              key={option}
              label={option}
              value={option}
              onPress={() => handleSortOptionChange(option)}
              selectedValue={sortOption}
            />
          ))}
          <TouchableOpacity style={styles.resultsButton}>
            <Text style={styles.resultsButtonText}>See all results</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "#f0f0f0",
    color: "#000",
  },
  closeIcon: {
    padding: 5,
  },
  scrollView: {
    marginHorizontal: 10,
  },
  filtersTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 5,
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
  sortTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 10,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginLeft: 20,
  },
  outerCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selectedOuterCircle: {
    borderColor: "#007bff",
  },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#007bff",
  },
  radioButtonLabel: {
    fontSize: 16,
    color: "#000",
  },
  resultsButton: {
    backgroundColor: "#007bff",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignSelf: "center",
    marginTop: 20,
  },
  resultsButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
export default Search;
