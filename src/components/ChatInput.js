import React, { Component } from "react"
import { Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import firebase from "firebase"
import uuidV4 from "uuid/v4"

import * as Icon from "@expo/vector-icons"

import { Colors, DEFAULT_PADDING } from "../constants/style"
import { isIOS } from "../utils/device"

class ChatInput extends Component {
  state = {
    keyboardHeight: 0,
    text: null,
  }

  _keyboardHideListener
  _keyboardShowListener

  componentDidMount() {
    if (isIOS) {
      this._keyboardShowListener = Keyboard.addListener(
        "keyboardWillShow",
        ({ endCoordinates }) => this.setState({ keyboardHeight: endCoordinates.height })
      )
      this._keyboardHideListener = Keyboard.addListener(
        "keyboardWillHide",
        () => this.setState({ keyboardHeight: 0 })
      )
    }
  }

  componentWillUnmount() {
    if (isIOS) {
      if (this._keyboardShowListener) this._keyboardShowListener.remove()
      if (this._keyboardHideListener) this._keyboardHideListener.remove()
    }
  }

  _onChangeText = text => this.setState({ text })

  _onPress = async () => {
    const { text } = this.state
    if (text && text.trim()) {
      const userId = firebase.auth().currentUser.uid
      try {
        const db = firebase.firestore()
        const profile = await db.collection("Users").doc(userId).get()
        const { currentTrip } = profile.data()
        await db
          .collection("Chats")
          .doc(`${currentTrip}`)
          .collection("chats")
          .doc(uuidV4())
          .set({
            createdAt: (new Date()).toISOString(),
            message: text,
            createdBy: userId,
          })
        this.setState({ text: null })
      } catch (err) {
        console.log("## ChatInput err:", err)
      }
    }
  }

  render() {
    const { onFocus } = this.props
    const { keyboardHeight, text } = this.state
    return (
      <View style={[styles.container, isIOS && { marginBottom: keyboardHeight }]}>
        <View style={styles.inputContainer}>
          <TextInput
            autoFocus
            blurOnSubmit={false}
            onChangeText={this._onChangeText}
            onFocus={onFocus}
            onSubmitEditing={this._onPress}
            placeholder={"Type a message here..."}
            returnKeyType="send"
            underlineColorAndroid="transparent"
            value={text}
          />
        </View>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.imageIcon}>
            <Icon.AntDesign color={Colors.darkGray} name="picture" size={25} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onPress} style={styles.sendIcon}>
            <Icon.Ionicons color={Colors.darkGray} name="md-send" size={25} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default ChatInput

const styles = StyleSheet.create({
  container: {
    borderColor: Colors.lightGray,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: DEFAULT_PADDING,
  },
  iconRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageIcon: {
    paddingHorizontal: DEFAULT_PADDING,
  },
  inputContainer: {
    alignSelf: "stretch",
    paddingBottom: DEFAULT_PADDING,
    paddingHorizontal: DEFAULT_PADDING,
  },
  sendIcon: {
    paddingHorizontal: DEFAULT_PADDING,
  },
})
