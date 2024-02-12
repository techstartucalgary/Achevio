import { Stack, Tabs } from "expo-router";
import React from "react";
import ScreenLayout from "../(tabs)/_layout";

const PagesLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="CommunitiesPage"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen name="Photopreview" options={{ headerShown: false }} />
      <Stack.Screen name="EditPost" options={{ headerShown: false }} />
      <Stack.Screen name="Videopreview" options={{ headerShown: false }} />
      <Stack.Screen name="PickCommunity" options={{ headerShown: false }} />
      <Stack.Screen
        name="CreateCommunities"
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack>
  );
};
export default PagesLayout;
