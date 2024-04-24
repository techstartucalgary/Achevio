import { Stack, Tabs } from "expo-router";
import React from "react";
import ScreenLayout from "../(tabs)/_layout";

const TutorialLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="yourProfile"
        options={{ headerShown: false }}
      />
     
    </Stack>
  );
};
export default TutorialLayout;
