import React, { Component } from "react"
import { Alert, StyleSheet, TextInput, TouchableOpacity } from "react-native"
import { Subscribe } from "unstated"
import firebase from "firebase"

import * as Icon from "@expo/vector-icons"
import Flex from "./common/Flex"
import Headline from "./common/Headline"
import Text from "./common/Text"

import ProfileContainer from "../containers/ProfileContainer"
import TripContainer from "../containers/TripContainer"

import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"

class AddTripItem extends Component {
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
    tripItem: "",
  }

  _currentTrip
  _tripItems

  _onSubmitEditing = async () => {
    const { navigation } = this.props
    const { tripItem } = this.state
    const currentTrip = this._currentTrip
    const tripItems = this._tripItems
    if (
      !tripItem.trim() ||
      tripItems.some(item => item.toLowerCase() === tripItem.toLowerCase())
    ) {
      navigation.goBack()
    } else {
      try {
        const updatedTripItems = [...tripItems, tripItem]
        await firebase.firestore()
          .collection("Trips")
          .doc(currentTrip)
          .update({ tripItems: updatedTripItems })
        this.setState({ tripItem: "" }, () => navigation.goBack())
      } catch (err) {
        Alert.alert("Error", err.message)
      }
    }
  }

  render() {
    return (
      <Flex>
        <Subscribe to={[TripContainer, ProfileContainer]}>
          {(tripContainer, profileContainer) => {
            this._currentTrip = profileContainer.state.profile.currentTrip
            this._tripItems = tripContainer.state.trip.tripItems
            return (
              <Flex style={styles.container}>
                <Headline>Add an item to the checklist</Headline>
                <TextInput
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoFocus
                  clearButtonMode="while-editing"
                  maxLength={100}
                  onChangeText={tripItem => this.setState({ tripItem })}
                  onSubmitEditing={this._onSubmitEditing}
                  placeholder={`Try "Passport"`}
                  placeholderTextColor={Colors.gray}
                  returnKeyType="done"
                  style={styles.textInput}
                  underlineColorAndroid="transparent"
                />
              </Flex>
            )
          }}
        </Subscribe>
      </Flex>
    )
  }
}

export default AddTripItem

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
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
