import React, { Component } from "react"

import firebase from "firebase"
import Loader from "./components/common/Loader"

import { APP, AUTH } from "./constants/routes"

export default class AuthHandler extends Component {

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? APP : AUTH)
    })
  }

  render() {
    return <Loader />
  }
}
