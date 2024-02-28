import React from "react";
import Home from "./home";
import { StatusBar } from "react-native";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

const index = () => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <Home />
    </>
  );
};

export default index;
