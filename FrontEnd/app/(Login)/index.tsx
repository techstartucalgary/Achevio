import React, { useEffect } from 'react';
import { useColorScheme, View, Text, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import { useRouter } from 'expo-router';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "../../constants/Colors";
import LoginScreen from './login';
import SignupScreen from './signup';
import Landing from './Landing';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  useEffect(() => {
    console.log('home');    
    }, []);
  return (
    <Swiper
      loop={false}
      showsPagination={true}
      dotColor="gray"
      
      activeDotColor={Colors.light.tint}
    >
    <View style={styles.slide}>
        <Landing />
      </View>
      <View style={styles.slide}>
        <LoginScreen />
      </View>
      
      <View style={styles.slide}>
        <SignupScreen />
      </View>
    </Swiper>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
  },
});
