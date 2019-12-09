import React, { Component } from "react"
import { AsyncStorage } from "react-native"

import firebase from "firebase"
import Loader from "./components/common/Loader"

import { SLIDESHOW_KEY } from "./components/Slideshow"
import { APP, AUTH, SLIDESHOW } from "./constants/routes"

export default class AuthHandler extends Component {

  async componentDidMount() {
    const slideshowKey = await AsyncStorage.getItem(SLIDESHOW_KEY)
    firebase.auth().onAuthStateChanged(user => {
      let route = AUTH
      if (user && !slideshowKey) {
        route = SLIDESHOW
      } else if (user) {
        route = APP
      }
      this.props.navigation.navigate(route)
    })
  }

  render() {
    return <Loader />
  }
}
