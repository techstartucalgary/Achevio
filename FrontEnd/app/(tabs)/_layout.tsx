import { Tabs } from "expo-router";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { View, useColorScheme } from "react-native";
import { useDispatch, useSelector } from "react-redux";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} {...props}  />;
}

const ScreenLayout = ({ completeTutorial }) => {
  const doneTutorial = useSelector(
    (state: any) => state.user.me.done_tutorial
  );
  const dispatch = useDispatch();


  // Determine the color scheme to apply appropriate colors
  // const colorScheme = useColorScheme();
  const activeTintColor = "#FFFFFF"; // Example: white for dark mode, black for light mode
  const inactiveTintColor = "#8e8e93"; // A neutral color for inactive icons
  const tabBarBackgroundColor = "#000"; // Set your desired background color here

  return (
    <Tabs
    screenOptions={() => ({
      headerShown: false,
        tabBarActiveTintColor: activeTintColor, // Color for active tab icons
        tabBarInactiveTintColor: inactiveTintColor, // Color for inactive tab icons
        tabBarStyle: {
          backgroundColor: tabBarBackgroundColor, // Apply the background color here
          zIndex: 9000,
        },
       
      })}
    >
      <Tabs.Screen
        name="Communities"
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="users"
              color={color}
            />
          ),
          tabBarLabel: "",
        }}
      />
      <Tabs.Screen
        name="Search"
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="search"
              color={color}
            />
          ),
          tabBarLabel: "",
        }}
      />
      <Tabs.Screen
        name="Camera"
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="camera"
              color={color}
            />
          ),
          tabBarLabel: "",
        }}
      />
      <Tabs.Screen
        name="Collage"
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="picture-o"
              color={color}
            />
          ),
          tabBarLabel: "",
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="user"
              color={color}
            />
          ),
          tabBarLabel: "",
        }}
      />
    </Tabs>
  );
};

export default ScreenLayout;
