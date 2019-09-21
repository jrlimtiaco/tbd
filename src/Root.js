import React from 'react'
import { StyleSheet, View } from 'react-native'
import { AppLoading, Font } from 'expo'

import AppNavigator from './AppNavigator'
import config from "./config"
import firebase from "firebase"
import "firebase/firestore"

import { Colors, Fonts } from "./constants/style"

firebase.initializeApp(config.firebase)
firebase.firestore().settings({ timestampsInSnapshots: true })

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  }

  _handleLoadingError = error => {
    console.warn(error)
  }

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true })
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Font.loadAsync({
        [Fonts.CerealBlack]: require('./assets/fonts/Cereal-Black.ttf'),
        [Fonts.CerealBook]: require('./assets/fonts/Cereal-Book.ttf'),
        [Fonts.CerealBold]: require('./assets/fonts/Cereal-Bold.ttf'),
        [Fonts.CerealExtraBold]: require('./assets/fonts/Cereal-ExtraBold.ttf'),
        [Fonts.CerealLight]: require('./assets/fonts/Cereal-Light.ttf'),
        [Fonts.CerealMedium]: require('./assets/fonts/Cereal-Medium.ttf'),
      }),
    ])
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      )
    } else {
      return (
        <View style={styles.container}>
          <AppNavigator />
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
})
