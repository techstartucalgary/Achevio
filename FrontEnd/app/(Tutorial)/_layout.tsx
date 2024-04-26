import { Stack, Tabs } from "expo-router";
import React from "react";

const TutorialLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="settingUpPage"
        options={{
          headerShown: false,
        }}
      />
     
    </Stack>
  );
};
export default TutorialLayout;
