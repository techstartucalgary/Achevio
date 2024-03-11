import { Tabs } from "expo-router";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} {...props} />;
}

const ScreenLayout = () => {
  // Determine the color scheme to apply appropriate colors
  const colorScheme = useColorScheme();
  const activeTintColor = colorScheme === 'dark' ? '#5C5CFF' : '#000'; // Example: white for dark mode, black for light mode
  const inactiveTintColor = '#8e8e93'; // A neutral color for inactive icons

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeTintColor, // Color for active tab icons
        tabBarInactiveTintColor: inactiveTintColor, // Color for inactive tab icons
      }}
    >
      <Tabs.Screen
        name="Communities"
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
          tabBarLabel: "",
        }}
      />
      <Tabs.Screen
        name="Search"
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
          tabBarLabel: "",
        }}
      />
      <Tabs.Screen
        name="Camera"
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="camera" color={color} />,
          tabBarLabel: "",
        }}
      />
      <Tabs.Screen
        name = "LeaderBoard"
        options={
          {
            tabBarIcon: ({ color }) => <TabBarIcon name="trophy" color={color} />,
            tabBarLabel: "",
          }
        }
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          tabBarLabel: "",
        }}
      />
    </Tabs>
  );
};

export default ScreenLayout;
