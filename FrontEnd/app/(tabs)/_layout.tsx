import {Tabs} from "expo-router";
import React from "react";
import Colors from "../../constants/Colors";
import { Pressable, useColorScheme } from "react-native";
import {FontAwesome as vectorIcon } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import HomeIcon from "../../assets/icons/homeIcon";
import CameraIcon from "../../assets/icons/CameraIcon";
import CollageIcon from "../../assets/icons/collageIcon";
import SearchIcon from "../../assets/icons/searchIcon";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof vectorIcon>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const ScreenLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="Communities" options={{
        tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
        headerShown: false,
        tabBarLabel: ''
      }} />
      <Tabs.Screen name="Search" options={{
        tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        headerShown: false,
        tabBarLabel: ''
      
      }} />
      <Tabs.Screen name="Camera" options ={{
        tabBarIcon: ({ color }) => <TabBarIcon name="camera" color={color} />,
        headerShown: false,
        tabBarLabel: ''
      }}/>
      <Tabs.Screen name="Profile" options ={{
        tabBarIcon: ({ color }) => <TabBarIcon name="photo" color={color} />,
        headerShown: false,
        tabBarLabel: ''
      
      }}/>
      <Tabs.Screen name="Settings" options={{
        tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        headerShown: false,
        tabBarLabel: ''
      }} />
      
    </Tabs>
  );
}
export default ScreenLayout