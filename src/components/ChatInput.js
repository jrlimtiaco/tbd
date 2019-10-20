import React, { Component } from "react"
import { Image, Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import * as Icon from "@expo/vector-icons"
import firebase from "firebase"
import uuidV4 from "uuid/v4"

import ImageButton from "./ImageButton"

import { DEVICE_WIDTH } from "../constants/dimensions"
import { Colors, DEFAULT_PADDING } from "../constants/style"
import { isIOS } from "../utils/device"

class ChatInput extends Component {
  state = {
    image: null,
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

  _removeImage = () => this.setState({ image: null })

  _setImage = image => this.setState({ image })

  _uploadImage = async ({ uri }) => {
    const fileType = uri.split(".").pop()
    const response = await fetch(uri)
    const blob = await response.blob()
    const ref = firebase
      .storage()
      .ref()
      .child("images")
      .child(`${uuidV4()}.${fileType}`)
    const snapshot = await ref.put(blob)
    const downloadURL = await snapshot.ref.getDownloadURL()
    return downloadURL
  }

  _onPress = async () => {
    let { image, text } = this.state
    if (image || text && text.trim()) {
      const userId = firebase.auth().currentUser.uid
      try {
        const db = firebase.firestore()
        const profile = await db.collection("Users").doc(userId).get()
        const { currentTrip } = profile.data()
        if (image) {
          image = await this._uploadImage(image)
        }
        await db
          .collection("Chats")
          .doc(`${currentTrip}`)
          .collection("chats")
          .doc(uuidV4())
          .set({
            createdAt: (new Date()).toISOString(),
            image,
            message: text,
            createdBy: userId,
          })
        this.setState({ image: null, text: null })
      } catch (err) {
        console.log("## ChatInput err:", err)
      }
    }
  }

  render() {
    const { onFocus } = this.props
    const { image, keyboardHeight, text } = this.state
    return (
      <View style={[styles.container, isIOS && { marginBottom: keyboardHeight }]}>
        {image && (
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={this._removeImage} style={styles.removeImage}>
              <Icon.Ionicons color={Colors.darkGray} name="ios-close-circle" size={25} />
            </TouchableOpacity>
            <Image
              resizeMode="contain"
              source={{ uri: image.uri }}
              style={[styles.image, { aspectRatio: image.width / image.height }]}
            />
          </View>
        )}
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
          <ImageButton style={styles.imageIcon} setImage={this._setImage}>
            <Icon.AntDesign color={Colors.darkGray} name="picture" size={25} />
          </ImageButton>
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
  image: {
    borderRadius: 5,
    width: DEVICE_WIDTH / 2,
  },
  imageContainer: {
    marginBottom: DEFAULT_PADDING,
    marginHorizontal: DEFAULT_PADDING,
    width: DEVICE_WIDTH / 2,
  },
  imageIcon: {
    paddingHorizontal: DEFAULT_PADDING,
  },
  inputContainer: {
    alignSelf: "stretch",
    paddingBottom: DEFAULT_PADDING,
    paddingHorizontal: DEFAULT_PADDING,
  },
  removeImage: {
    right: 2,
    top: 2,
    position: "absolute",
    zIndex: 10,
  },
  sendIcon: {
    paddingHorizontal: DEFAULT_PADDING,
  },
})
