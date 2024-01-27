import React, { useEffect } from "react";
import { useColorScheme, View, Text, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";
import { useLocalSearchParams, router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "../../constants/Colors";
import LoginScreen from "./login";
import SignupScreen from "./signup";
import Signup2Screen from "./signup2";
import Landing from "./Landing";
import { Int32 } from "react-native/Libraries/Types/CodegenTypes";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams();
  const slider = params.slide || 0;

  useEffect(() => {
    console.log("home");
  }, []);
  return (
    <Swiper
      loop={false}
      showsPagination={true}
      dotColor="gray"
      activeDotColor={Colors.light.tint}
      index={slider as Int32}>
      <View style={styles.slide}>
        <Landing />
      </View>
      <View style={styles.slide}>
        <LoginScreen navigation={undefined} />
      </View>

      <View style={styles.slide}>
        <SignupScreen />
      </View>
      <View style={styles.slide}>
        <Signup2Screen />
      </View>
    </Swiper>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
  },
});
