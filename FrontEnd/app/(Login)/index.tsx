import React, { useEffect } from "react";
import Home from "./home";
import { StatusBar } from "react-native";
import * as WebBrowser from "expo-web-browser";
import NativeDevSettings from 'react-native/Libraries/NativeModules/specs/NativeDevSettings';
if (__DEV__) {
  require("../ReactotronConfig");
}

WebBrowser.maybeCompleteAuthSession();
import { LogBox } from 'react-native';
import { View } from "../../components/Themed";

LogBox.ignoreAllLogs();

const index = () => {
  const connectToRemoteDebugger = () => {
    NativeDevSettings.setIsDebuggingRemotely(true);
  };
  useEffect(() => {
    connectToRemoteDebugger();
  }
  , []);
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle="light-content" />
      <Home />
    </View>
  );
};


export default index;
