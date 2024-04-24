import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import Swiper from "react-native-swiper";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import axios from "axios";
import { router } from "expo-router";
import { setMe } from "../redux/actions/userActions";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "../../constants/Colors";
import LoginScreen from "./login";
import SignupScreen from "./signup";
import Signup2Screen from "./signup2";
import Landing from "./Landing";
import { Int32 } from "react-native/Libraries/Types/CodegenTypes";
import LottieView from "lottie-react-native";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} {...props} />;
}

export default function TabLayout() {
  const { userName, passWord} = useSelector((state: any) => state.account);
  const { url } = useSelector((state: any) => state.user);
  const [errorMessageVisible, setErrorMessageVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useLocalSearchParams();
  const slider = params.slider || 0;
  const { username, first_name, last_name } = params;
  console.log(slider);

  async function postLoginInfo(username: string, password: string) {
    try {
      const configurationObject = {
        method: "post",
        url: `${url}/login`,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        data: { username, password },
      };

      const response = await axios(configurationObject);
      
      console.log(response);
      if (response.status === 201) {
        const response = await axios.get(`${url}/user/me`);
        router.push("/(tabs)/Camera");
      }
    }
    catch (error) {
      console.log(error);
      Alert.alert("Error", "Invalid username or password");
    }
  }

  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Start loading
  
      if (userName && passWord) {
        postLoginInfo(userName, passWord)
          .catch(error => {
            console.error('Login failed:', error);
          })

      } else {
        // If no credentials, still wait 1 second
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    }, [userName])
  );

  if (errorMessageVisible) {
    return (
      <View style={styles.slide}>
        <Text>{errorMessage}</Text>
      </View>
    );
  }

  return (
    loading ? (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <LottieView
        source={require("../../assets/rocketLoad.json")}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
    ) : (
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
        <LoginScreen/>
      </View>

      <View style={styles.slide}>
        <SignupScreen />
      </View>
      <View style={styles.slide}>
        <Signup2Screen username={username} first_name={first_name} last_name={last_name} />
      </View>
    </Swiper>
    )
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
  },
  animation: {
    width: 120, // Adjust the size as needed
    height: 120, // Adjust the size as needed
  },
});
function dispatch(arg0: { type: string; payload: any; }) {
  throw new Error("Function not implemented.");
}

