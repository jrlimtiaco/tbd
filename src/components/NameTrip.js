import React, { Component } from "react"
import { Alert, Modal, StyleSheet, TextInput } from "react-native"

import Flex from "./common/Flex"
import Text from "./common/Text"

import firebase from "firebase"

import { Colors, Fonts } from "../constants/style"

class NameTrip extends Component {
  state = {
    input: null,
  }

  _onSubmitEditing = async () => {
    const { currentTrip, onClose } = this.props
    const { input: tripName } = this.state
    if (!tripName) {
      return onClose()
    }
    try {
      await firebase.firestore()
        .collection("Trips")
        .doc(currentTrip)
        .update({ tripName })
      onClose()
    } catch (err) {
      Alert.alert("Error", "Unable to save changes. Please try again.")
    }
  }

  render() {
    const { location, onClose, visible } = this.props
    return (
      <Modal
        animationType={"fade"}
        onRequestClose={onClose}
        supportedOrientations={["portrait"]}
        transparent={false}
        visible={visible}
      >
        <Flex style={styles.container}>
          <Text
            color={Colors.darkGray}
            size="xxxxxlarge"
            style={styles.headingText}
            type={Fonts.CerealExtraBold}
          >
            Trip Name
          </Text>
          <TextInput
            autoCapitalize="none"
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
        </Flex>
      </Modal>
    )
  }
}

export default NameTrip

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
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
