
import React from 'react'
import Home from './home'
import { StatusBar } from 'react-native'
import * as WebBrowser from 'expo-web-browser';


WebBrowser.maybeCompleteAuthSession();

const index = () => {
  return (
    <>
    <StatusBar barStyle="dark-content" />
      <Home />
    </>
  )
}

export default index
