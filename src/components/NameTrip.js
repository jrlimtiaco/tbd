import React, { Component } from "react"
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { Subscribe } from "unstated"
import firebase from "firebase"

import * as Icon from "@expo/vector-icons"
import Flex from "./common/Flex"
import Headline from "./common/Headline"
import Text from "./common/Text"

import ProfileContainer from "../containers/ProfileContainer"
import TripContainer from "../containers/TripContainer"

import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"

class NameTrip extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Icon.AntDesign color={Colors.darkGray} name="left" size={25} />
        </TouchableOpacity>
      ),
    }
  }

  state = {
    input: null,
  }

  _onSubmitEditing = async () => {
    const { navigation } = this.props
    const { input: tripName } = this.state
    if (!tripName) {
      return navigation.goBack()
    }
    try {
      await firebase.firestore()
        .collection("Trips")
        .doc(this._currentTrip)
        .update({ tripName })
      navigation.goBack()
    } catch (err) {
      Alert.alert("Error", "Unable to save changes. Please try again.")
    }
  }

  render() {
    return (
      <Subscribe to={[ProfileContainer, TripContainer]}>
        {(profileContainer, tripContainer) => {
          const { currentTrip } = profileContainer.state.profile
          const { trip: { location } } = tripContainer.state
          this._currentTrip = currentTrip
          return (
            <Flex>
              <View style={styles.container}>
                <Headline>Trip Name</Headline>
                <TextInput
                  autoCapitalize="sentences"
                  autoCorrect={false}
                  autoFocus
                  clearButtonMode="while-editing"
                  maxLength={25}
                  onChangeText={input => this.setState({ input })}
                  onSubmitEditing={this._onSubmitEditing}
                  placeholder={`Try "Trip to ${location}"`}
                  placeholderTextColor={Colors.gray}
                  returnKeyType="done"
                  style={styles.textInput}
                  underlineColorAndroid="transparent"
                />
              </View>
            </Flex>
          )
        }}
      </Subscribe>
    )
  }
}

export default NameTrip

const styles = StyleSheet.create({
  container: {
    marginHorizontal: DEFAULT_PADDING,
  },
  headerIcon: {
    paddingHorizontal: DEFAULT_PADDING / 2,
  },
  textInput: {
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 1,
    fontFamily: Fonts.CerealExtraBold,
    fontSize: 20,
    paddingVertical: 10,
  },
})
