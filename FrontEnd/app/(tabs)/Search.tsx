import React from 'react'
import {StyleSheet, Text, View, TextInput, Pressable, ActivityIndicator, FlatList} from 'react-native'
import {useState, useEffect} from "react";
import {Feather, Entypo} from "@expo/vector-icons"

type Community = {
  communityTitle: string,
  communityTags: string[],
  communityID: string,
}
type SearchResult = Community[]
type SearchData = {
  mainPhrase: string,
  tags: string[],
}

const communityItem = (title: string, tag: string[]) => {

  const tagItem = (tag: string) => {

    return (
      <Text>
        {tag}
      </Text>
    )
  }

  return (
    <View style={{borderStyle:"solid", borderColor:"black"}}>
      <Text style={{fontSize:20}}>
        {title}
      </Text>
      <FlatList
        data={tag}
        renderItem={({item}) => tagItem(item)}
        keyExtractor={item => item}
        horizontal={true}
      />
    </View>
  )
}


const Search = () => {
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [inputClicked, setInputClicked] = useState<boolean>(false);
  const [tagMenuOpened, setTagMenuOpened] = useState<boolean>(true)
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<SearchResult>(null);
  const [showCommunityList, setShowCommunityList] = useState<boolean>(false)

  // dummy test data
  const testResponse: SearchResult = [{
    communityID: "1",
    communityTags: ["1", "2"],
    communityTitle: "1",
  }, {
    communityID: "2",
    communityTags: ["2", "3"],
    communityTitle: "2",
  }, {
    communityID: "3",
    communityTags: ["3", "4"],
    communityTitle: "3",
  }]


  // post search phrase
  useEffect(() => {
    setShowCommunityList(false)
    if (searchPhrase !== "") {
      setShowLoading(true)
    } else {
      setShowLoading(false)
    }
    console.log(searchPhrase)
    setTimeout(()=>{}, 1000)
    setResponse(testResponse)
  }, [searchPhrase])

  // update community list based on the response
  useEffect(() => {
    setShowLoading(false)
    setShowCommunityList(true)
  }, [response])

  return (
    <>
      {/*top search bar*/}
      <View style={styles.searchBarWrap}>

        <View style={inputClicked ? styles.searchBar_clicked : styles.searchBar_unclicked}>

          {/*Search icon*/}
          <Feather name="search" size={20} color="black" style={{marginLeft: 1}}/>

          {/*Search input*/}
          <TextInput
            style={inputClicked ? styles.input_clicked : styles.input_unclicked}
            placeholder="Search"
            value={searchPhrase}
            onChangeText={setSearchPhrase}
            onFocus={() => {
              setInputClicked(true);
            }
            }/>

          {/*Clear icon*/}
          {
            inputClicked && (
              <Pressable onPress={() => {
                setSearchPhrase("")
                setResponse(null)
              }}>
                <Entypo name="cross" size={20} color="black" style={{padding: 1}}/>
              </Pressable>
            )}

        </View>
        {/*tag menu control button*/}
        {
          tagMenuOpened && (
            <Pressable onPress={() => {
              setTagMenuOpened(false)
            }}>
              <Entypo name="chevron-down" size={30} color="black"/>
            </Pressable>
          )
        }

        {
          !tagMenuOpened && (
            <Pressable onPress={() => {
              setTagMenuOpened(true)
            }}>
              <Entypo name="chevron-up" size={30} color="black"/>
            </Pressable>
          )
        }


        {/*Cancel button*/}
        {/*{inputClicked && (*/}
        {/*  <View>*/}
        {/*    <Pressable onPress={() => {*/}
        {/*      Keyboard.dismiss();*/}
        {/*      setInputClicked(false);*/}
        {/*    }}>*/}
        {/*      <Text style={{fontSize: 18, color: '#4169E1', marginLeft: 3}}>Cancel</Text>*/}
        {/*    </Pressable>*/}
        {/*  </View>*/}
        {/*)}*/}
      </View>

      {/*search result*/}
      <View style={styles.searchResultWrap}>
        {
          showLoading && (
            <ActivityIndicator size={"large"} color={'#000000'} animating={showLoading} style={{marginTop: 10}}/>
          )
        }

        {
          showCommunityList && (
            <FlatList
              data={response}
              renderItem={({item}) => communityItem(item.communityTitle, item.communityTags)}
              keyExtractor={item => item.communityTitle}
            />
          )
        }
      </View>
    </>
  )
}


const styles = StyleSheet.create({
  searchBarWrap: {
    flex: 1,
    marginTop: 40,
    // backgroundColor: '#ffffff', // Set your background color
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginLeft: 10,
  },
  searchBar_unclicked: {
    padding: 15,
    flexDirection: "row",
    width: "85%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  searchBar_clicked: {
    padding: 15,
    flexDirection: "row",
    width: "80%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  input_clicked: {
    fontSize: 20,
    marginLeft: 10,
    width: "80%",
  },
  input_unclicked: {
    fontSize: 20,
    marginLeft: 10,
    width: "85%",
  },
  searchResultWrap: {
    flexDirection: "column",
    flex: 10,

  }
});

export default Search