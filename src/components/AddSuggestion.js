import React, { Component } from "react"
import { Alert, StyleSheet, TextInput, TouchableOpacity } from "react-native"
import { Subscribe } from "unstated"
import firebase from "firebase"
import uuidV4 from "uuid/v4"

import Flex from "./common/Flex"
import Headline from "./common/Headline"
import Icon from "@expo/vector-icons"
import Text from "./common/Text"

import ProfileContainer from "../containers/ProfileContainer"
import TripContainer from "../containers/TripContainer"

import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"

class AddSuggestion extends Component {
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
    suggestion: null,
  }

  _onSubmitEditing = async () => {
    if (!this.state.suggestion || !this.state.suggestion.trim()) {
      this.props.navigation.goBack()
    } else {
      try {
        await firebase.firestore()
          .collection("Suggestions")
          .doc(this._currentTrip)
          .collection("suggestions")
          .doc(uuidV4())
          .set({
            likes: [],
            suggestion: this.state.suggestion,
            createdAt: (new Date()).toISOString(),
          }, {
            merge: true
          })
        this.props.navigation.goBack()
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
                <Headline>Add a suggestion for your trip</Headline>
                <TextInput
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoFocus
                  clearButtonMode="while-editing"
                  maxLength={25}
                  onChangeText={suggestion => this.setState({ suggestion })}
                  onSubmitEditing={this._onSubmitEditing}
                  placeholder={`Try "Drinks at night"`}
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

export default AddSuggestion

const styles = StyleSheet.create({
  container: {
    marginHorizontal: DEFAULT_PADDING,
  },
  headerIcon: {
    paddingHorizontal: DEFAULT_PADDING / 2,
  },
  headingText: {
    paddingVertical: 20,
  },
  textInput: {
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 1,
    fontFamily: Fonts.CerealExtraBold,
    fontSize: 20,
    paddingVertical: 10,
  },
})
