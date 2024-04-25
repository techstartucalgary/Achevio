import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  RefreshControl,
  ImageBackground,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import axios from "axios";
import { router, useFocusEffect } from "expo-router";
import { Image } from "expo-image";

type TagProps = {
  text: string;
  color: string;
  selected: boolean;
  onSelect: () => void;
};

const Tag: React.FC<TagProps> = ({ text, color, selected, onSelect }) => (
  <TouchableOpacity
    style={[
      styles.tag,
      { borderColor: color },
      selected && { backgroundColor: color },
    ]}
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
interface tags {
  name: string;
  color: string;
}
interface data {
  forYou: any;
  popular: any;
  trending: any;
  activeTab: any;
}
const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [tags, setTags] = useState<tags[]>([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortOption, setSortOption] = useState<string>("");
  const [isFiltersVisible, setIsFiltersVisible] = useState<boolean>(false); // State to manage filter visibility
  const { url } = useSelector((state: any) => state.user);
  const [data, setData] = useState<data>({
    forYou: [],
    popular: [],
    trending: [],
    activeTab: [],
  });
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState("forYou");

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((tag) => tag !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const res = await axios.get(`${url}/community/search`, {});
    const resTags = await axios.get(`${url}/tag`, {});
    setData(res.data);
    if (activeTab === "forYou") {
      // Fetch data for the "For You" tab
      setFilteredData(res.data.forYou);
    } else if (activeTab === "popular") {
      // Fetch data for the "Popular" tab
      setFilteredData(res.data.popular);
    } else if (activeTab === "trending") {
      // Fetch data for the "Trending" tab
      setFilteredData(res.data.trending);
    }
    setTags(resTags.data);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData(); // This will now also update the avatarUri state
    } catch (error) {
      console.error("Failed to refresh profile data:", error);
    }

    setRefreshing(false);
  }, []);

  const filterByCommunityName = (searchQuery) => {
    if (filteredData && filteredData.length > 0) {
      return filteredData.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      return [];
    }
  };
  useEffect(() => {
    if (activeTab === "forYou") {
      // Fetch data for the "For You" tab
      setFilteredData(data.forYou);
    } else if (activeTab === "popular") {
      // Fetch data for the "Popular" tab
      setFilteredData(data.popular);
    } else if (activeTab === "trending") {
      // Fetch data for the "Trending" tab
      setFilteredData(data.trending);
    }
  }, [activeTab]);

  useEffect(() => {
    let filtered = [...data[activeTab]]; // Start with a copy of the active tab's data

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((item) =>
        item.tags.some((tag) => selectedTags.includes(tag.name))
      );
    }
  }, [searchQuery]);

  // Function to handle the selection of sort options
  const handleSortOptionChange = (option: string) => {
    setSortOption((prev) => (prev === option ? "" : option));
  };

  // Function to toggle filter visibility
  const toggleFiltersVisibility = () => {
    setIsFiltersVisible((prev) => !prev);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
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
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {["forYou", "popular", "trending"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {isFiltersVisible && (
            <ScrollView style={styles.scrollView}>
              <Text style={styles.filtersTitle}>Filters</Text>
              <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <Tag
                    key={`${tag.name}_${index}`} // Combining name and index for uniqueness
                    text={tag.name}
                    color={tag.color}
                    selected={selectedTags.includes(tag.name)}
                    onSelect={() => toggleTag(tag.name)}
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
                  key={option + "radio"}
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

          {filteredData && filteredData.length > 0 ? (
            <View>
              {filteredData.map((item, index) => (
                <TouchableOpacity
                  style={styles.communityItem}
                  onPress={() => {
                    router.push({
                      pathname: "/(pages)/CommunitiesPage", // The route name
                      params: {
                        communityId: item.id,
                        communityName: item.name,
                        communityStreak: item.streak,
                        communityTags: item.tags.map((tag) => {
                          return tag.name + " " + tag.color;
                        }),
                        communityImage: `${url}/community/image/${item.id}.jpg`,
                      }, // Parameters as an object
                    });
                  }}
                >
                  <ImageBackground
                    source={{ uri: `${url}/community/image/${item.id}.jpg` }}
                    style={styles.communityItemBackground}
                    imageStyle={styles.communityItemImageStyle}
                  >
                    <Text style={styles.communityTitle}>{item.name}</Text>
                    <View style={styles.textOverlay}>
                      <Text style={styles.communityStreak}>{item.streak}</Text>
                      <View style={{ flexDirection: "row" }}>
                        {item.tags.map((tag, index) => (
                          <Text
                            style={[
                              styles.communityTags,
                              {
                                backgroundColor: tag.color,
                                padding: 2,
                                textAlign: "center",
                                marginHorizontal: 2,
                              },
                            ]}
                            key={`${tag.name}_${index}`}
                          >
                            {tag.name + " "}
                          </Text> // Use a combination of name and index
                        ))}
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View>
              <Text>No results found</Text>
            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0000",
    marginTop: 50,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3a3a3b",
    borderRadius: 10,
    height: 45,
    padding: 10,
    marginTop: 10,
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "#3a3a3b",
    color: "#000",
  },
  textOverlay: {
    // Semi-transparent overlay for improved text readability
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 10,
  },
  communityItem: {
    height: 120, // Set a fixed height for your community item
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 10, // Rounded corners for the item
    overflow: "hidden", // This ensures the image respects the border radius
  },
  communityItemImageStyle: {
    opacity: 0.5, // Semi-transparent overlay for improved text readability
    borderRadius: 10, // If you want the image itself to have rounded corners
  },
  communityItemBackground: {
    flex: 1, // Ensure it fills the container
    justifyContent: "flex-end", // Align content to the bottom
  },
  communityTitle: {
    position: "absolute",
    top: 10,
    left: 10,
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  communityStreak: {
    position: "absolute",
    top: 20,
    left: 10,
    color: "#fff",
  },
  communityTags: {
    color: "#fff",
    fontSize: 12,
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
    borderColor: "#5C5CFF",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 5,
  },
  tagSelected: {
    backgroundColor: "#5C5CFF",
  },
  tagText: {
    color: "white",
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
    borderColor: "#5C5CFF",
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
    color: "white",
  },
  resultsButton: {
    backgroundColor: "#5C5CFF",
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
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#5C5CFF",
  },
  tabText: {
    color: "#ffffff",
    fontSize: 16,
  },
  activeTabText: {
    fontWeight: "bold",
    color: "#5C5CFF",
  },
  tabContent: {
    padding: 20,
  },
});
export default Search;
