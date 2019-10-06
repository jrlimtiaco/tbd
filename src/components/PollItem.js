import React, { Component } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import firebase from "firebase"

import Icon from "@expo/vector-icons"
import Text from "./common/Text"

import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"

class PollItem extends Component {

  _onPress = async (pollId, optionId) => {
    const { options } = this.props.poll
    const userId = firebase.auth().currentUser.uid
    const profile = await firebase.firestore().collection("Users").doc(`${userId}`).get()
    const { currentTrip } = profile.data()
    try {
      await firebase.firestore()
        .collection("Polls")
        .doc(currentTrip)
        .collection("polls")
        .doc(pollId)
        .update({
          options: options.map(option => {
            const votes = option.id === optionId
              ? option.votes.includes(userId)
              ? option.votes.filter(vote => vote !== userId)
              : [...option.votes, userId]
              : option.votes.filter(vote => vote !== userId)
            return { ...option, votes }
          })
        })
    } catch (err) {
      console.log("## PollItem _onPress err:", err)
    }
  }

  render() {
    const { id, options, question } = this.props.poll
    return (
      <View style={styles.pollContainer}>
        <Text color={Colors.darkGray} size="xxlarge" style={styles.question} type={Fonts.CerealExtraBold}>
          {question}
        </Text>
        {options.map(option => {
          const isSelected = option.votes.includes(firebase.auth().currentUser.uid)
          const numberOfVotes = option.votes.length
          return (
            <View key={option.id} style={styles.optionContainer}>
              <TouchableOpacity style={styles.button} onPress={() => this._onPress(id, option.id)}>
                {isSelected && (
                  <Icon.Ionicons
                    color={Colors.black}
                    name="md-checkmark"
                    size={15}
                  />
                )}
              </TouchableOpacity>
              <View style={styles.optionTextContainer}>
                <View style={styles.option}>
                  <Text size="large" type={Fonts.CerealBook}>
                    {option.option}
                  </Text>
                </View>
                <Text color={Colors.darkGray} size="large" type={Fonts.CerealBook}>
                  {`${numberOfVotes} votes`}
                </Text>
              </View>
            </View>
          )
        })}
      </View>
    )
  }
}

export default PollItem

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderColor: Colors.black,
    borderRadius: 12.5,
    borderWidth: 1,
    height: 25,
    justifyContent: "center",
    width: 25,
  },
  option: {
    flex: 1,
    paddingHorizontal: 5,
  },
  optionContainer: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: DEFAULT_PADDING,
  },
  optionTextContainer: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },
  pollContainer: {
    borderColor: Colors.lightGray,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10,
  },
  question: {
    paddingVertical: 10,
  },
})
