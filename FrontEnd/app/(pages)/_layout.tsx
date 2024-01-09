  import {Stack, Tabs} from "expo-router";
  import React from "react";
  import ScreenLayout from "../(tabs)/_layout";

  const PagesLayout = () => {
    return (
      <Stack>
        <Stack.Screen name="CommunitiesPage" options={
          {headerShown: false ,presentation: "modal"}
        }
        />
        <Stack.Screen name="Photopreview" options={
          {headerShown: false}

        }/>
      </Stack>
    );
  }
  export default PagesLayout