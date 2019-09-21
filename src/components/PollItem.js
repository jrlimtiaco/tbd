import React, { Component } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import firebase from "firebase"

import Icon from "@expo/vector-icons"
import Text from "./common/Text"

import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"

class PollItem extends Component {

  _onPress = async (poll, option) => {
    const userId = firebase.auth().currentUser.uid
    const profile = await firebase.firestore().collection("Users").doc(`${userId}`).get()
    const { currentTrip } = profile.data()
    let { options } = this.props.polls[poll]
    options = options.map(o => {
      return {
        ...o,
        responses: o.id === option && !o.responses.includes(userId)
          ? [...o.responses, userId]
          : o.responses.filter(r => r !== userId)
      }
    })
    const polls = {
      ...this.props.polls,
      [poll]: {
        ...this.props.polls[poll],
        options,
      }
    }
    try {
      await firebase.firestore()
        .collection("Trips")
        .doc(currentTrip)
        .update({ polls })
    } catch (err) {
      console.log("## PollItem _onPress err:", err)
    }
  }

  render() {
    const { isLastPoll, poll: { id, options, question } } = this.props
    return (
      <View style={[styles.pollContainer, isLastPoll && styles.noBorder]}>
        <Text color={Colors.darkGray} size="xxlarge" style={styles.question} type={Fonts.CerealExtraBold}>
          {question}
        </Text>
        {options.map(option => {
          const isSelected = option.responses.includes(firebase.auth().currentUser.uid)
          const numberOfVotes = option.responses.length
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
  noBorder: {
    borderBottomWidth: 0,
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
