import React, { Component } from "react"
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native"
import firebase from "firebase"

import * as Icon from "@expo/vector-icons"
import Text from "./common/Text"

import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"

class SuggestionItem extends Component {

  _onPress = async () => {
    const { id, likes } = this.props.suggestion
    const userId = firebase.auth().currentUser.uid
    const profile = await firebase.firestore().collection("Users").doc(`${userId}`).get()
    const { currentTrip } = profile.data()
    try {
      await firebase.firestore()
        .collection("Suggestions")
        .doc(currentTrip)
        .collection("suggestions")
        .doc(id)
        .update({
          likes: likes.includes(userId)
            ? likes.filter(like => like !== userId)
            : [...likes, userId]
        })
    } catch (err) {
      console.log("## SuggestionItem _onPress err:", err)
      Alert.alert("Error", "Unable to like suggestion. Please try again.")
    }
  }

  render() {
    const { suggestion } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text size="large" style={styles.text} type={Fonts.CerealBook}>
            {suggestion.suggestion}
          </Text>
        </View>
        <TouchableOpacity onPress={this._onPress} style={styles.likeContainer}>
          <Icon.Feather name="thumbs-up" size={18} tintColor={"black"} />
          <Text type={Fonts.CerealBook}>
            {`${suggestion.likes.length} likes`}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default SuggestionItem

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightGray,
    flexDirection: "row",
    paddingVertical: DEFAULT_PADDING,
  },
  likeContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: DEFAULT_PADDING,
  },
  text: {
    paddingHorizontal: 5,
  },
  textContainer: {
    flex: 1,
  },
})
