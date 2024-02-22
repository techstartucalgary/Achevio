// _layout.tsx
import { Link, Stack, Tabs } from "expo-router";
export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="home"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="login"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="signup"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="Landing"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="signup2"
        options={{ headerShown: false, animation: "none" }}
      />
    </Stack>
  );
}
