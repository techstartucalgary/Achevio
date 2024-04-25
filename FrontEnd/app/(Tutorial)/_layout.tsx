import { Stack, Tabs } from "expo-router";
import React from "react";
import ScreenLayout from "../(tabs)/_layout";

const TutorialLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="yourProfile"
        options={{
          headerShown: false,
          presentation: 'card',
          animationTypeForReplace: 'push',
          animation:'slide_from_right'
        }}        
      />
      <Stack.Screen
        name="pickIntrest"
        options={{
          headerShown: false,
          presentation: 'card',
          animationTypeForReplace: 'push',
          animation:'slide_from_right'
        }}
      />
      <Stack.Screen
        name="AddFriendsPage"
        options={{
          headerShown: false,
          presentation: 'card',
          animationTypeForReplace: 'push',
          animation:'slide_from_right'
        }}
      />
     
    </Stack>
  );
};
export default TutorialLayout;
