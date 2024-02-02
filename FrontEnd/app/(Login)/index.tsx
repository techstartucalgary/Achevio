
import React from 'react'
import Home from './home'
import {Provider} from 'react-redux'
import { store } from '../redux/store'
import { StatusBar } from 'react-native'

const index = () => {
  return (
    <>
    <StatusBar barStyle="dark-content" />
      <Home />
    </>
  )
}

export default index
