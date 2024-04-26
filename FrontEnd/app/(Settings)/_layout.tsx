import { Stack, Tabs } from "expo-router";
import React from "react";

const PagesLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="EditProfile" options={{ headerShown: false }} />
      <Stack.Screen name="ChangePassword" options={{ headerShown: false }} />
      <Stack.Screen
        name="SecurityAndPrivacy"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="InviteFriends" options={{ headerShown: false }} />
      <Stack.Screen name="AddPaymentMethod" options={{ headerShown: false }} />
      <Stack.Screen name="AboutUs" options={{ headerShown: false }} />
      <Stack.Screen name="PrivacyPolicy" options={{ headerShown: false }} />
      <Stack.Screen name="AddFriends" options={{ headerShown: false }} />
      <Stack.Screen name="YourFriends" options={{ headerShown: false }} />
      <Stack.Screen name="MainSettingsPage" options={{ headerShown: false }} />
    </Stack>
  );
};
export default PagesLayout;
