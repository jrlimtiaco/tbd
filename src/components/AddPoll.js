import React, { Component } from "react"
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { Subscribe } from "unstated"
import { range } from "lodash"
import firebase from "firebase"
import uuidV4 from "uuid/v4"

import AddButton from "./common/AddButton"
import Button from "./common/Button"
import Flex from "./common/Flex"
import Headline from "./common/Headline"
import Icon from "@expo/vector-icons"
import Input from "./common/Input"
import Text from "./common/Text"

import TripContainer from "../containers/TripContainer"

import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"

class AddPoll extends Component {
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
    numberOfOptions: 2,
    pending: false,
    question: null,
  }

  _createPoll = async () => {
    const { numberOfOptions, question } = this.state
    const options = range(0, numberOfOptions)
    if (!question || options.some((option, index) => !this.state[`${index + 1}`])) {
      this._question.validate()
      return options.forEach((option, index) => this[`_${index + 1}`].validate())
    } else {
      try {
        this.setState({ pending: true })
        const id = uuidV4()
        const db = firebase.firestore()
        const profile = await db.collection("Users").doc(`${firebase.auth().currentUser.uid}`).get()
        const { currentTrip } = profile.data()
        await db
          .collection("Trips")
          .doc(`${currentTrip}`)
          .update({
            polls: {
              ...this._polls,
              [id]: {
                id,
                question: question.includes("?") ? question : question + "?",
                options: options.map((option, index) => {
                  return {
                    id: uuidV4(),
                    option: this.state[`${index + 1}`],
                    responses: [],
                  }
                }),
              },
            }
          })
        this.props.navigation.goBack()
      } catch (err) {
        console.log("## _createPoll err:", err)
        Alert.alert("Error", "Something went wrong creating your poll. Please try again.")
        this.setState({ pending: false })
      }
    }
  }

  render() {
    const { numberOfOptions, pending, question } = this.state
    const options = range(0, numberOfOptions)
    return (
      <Subscribe to={[TripContainer]}>
        {(tripContainer) => {
          this._polls = tripContainer.state.trip.polls
          return (
            <Flex>
              <Flex style={styles.container}>
                <Headline>Create a poll for your trip</Headline>
                <ScrollView
                  ref={ref => (this._scroll = ref)}
                  keyboardDismissMode="on-drag"
                  keyboardShouldPersistTaps="always"
                  onContentSizeChange={() => this._scroll && this._scroll.scrollToEnd()}
                  showsVerticalScrollIndicator={false}
                >
                  <Text>QUESTION</Text>
                  <Input
                    ref={ref => (this._question = ref)}
                    id="question"
                    autoCapitalize="sentences"
                    autoCorrect={false}
                    autoFocus
                    clearButtonMode="while-editing"
                    containerStyle={styles.textInputContainer}
                    maxLength={30}
                    onChangeText={question => this.setState({ question })}
                    onSubmitEditing={() => this._1 && this._1.focus()}
                    placeholder={"Enter a question"}
                    placeholderTextColor={Colors.lightGray}
                    required
                    returnKeyType="next"
                    style={styles.textInput}
                    underlineColorAndroid="transparent"
                    value={this.state.question}
                  />
                  {options.map((option, index) => {
                    const optionNumber = index + 1
                    const isLastOption = index === options.length - 1
                    return (
                      <View key={index}>
                        <Text>{`OPTION ${optionNumber}`}</Text>
                        <Input
                          ref={ref => (this[`_${optionNumber}`] = ref)}
                          id={`option ${optionNumber}`}
                          autoCapitalize="sentences"
                          autoCorrect={false}
                          clearButtonMode="while-editing"
                          containerStyle={styles.textInputContainer}
                          maxLength={30}
                          onChangeText={text => this.setState({ [optionNumber]: text })}
                          placeholder={"Enter an option"}
                          placeholderTextColor={Colors.lightGray}
                          required
                          returnKeyType={isLastOption ? "done" : "next"}
                          style={styles.textInput}
                          underlineColorAndroid="transparent"
                          value={this.state[optionNumber] || null}
                          onSubmitEditing={() => {
                            if (isLastOption) {
                              this._createPoll()
                            } else {
                              const nextInput = this[`_${optionNumber + 1}`]
                              if (nextInput) {
                                nextInput.focus()
                              }
                            }
                          }}
                        />
                      </View>
                    )
                  })}
                  <AddButton
                    onPress={() => this.setState({ numberOfOptions: numberOfOptions + 1 })}
                    text="Add option"
                  />
                </ScrollView>
              </Flex>
              <Button
                onPress={this._createPoll}
                pending={pending}
                style={styles.createButton}
              >
                <Text>Create poll</Text>
              </Button>
            </Flex>
          )
        }}
      </Subscribe>
    )
  }
}

export default AddPoll

const styles = StyleSheet.create({
  createButton: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    marginHorizontal: 40,
  },
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
  textInputContainer: {
    paddingBottom: 10,
  },
})
