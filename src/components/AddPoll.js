import React, { Component } from "react"
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Subscribe } from "unstated"
import { range } from "lodash"
import firebase from "firebase"
import uuidV4 from "uuid/v4"

import * as Icon from "@expo/vector-icons"
import AddButton from "./common/AddButton"
import Button from "./common/Button"
import Flex from "./common/Flex"
import Headline from "./common/Headline"
import Input from "./common/Input"
import Text from "./common/Text"

import TripContainer from "../containers/TripContainer"

import { DEVICE_WIDTH } from "../constants/dimensions"
import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"

class AddPoll extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Icon.AntDesign color={Colors.darkGray} name="left" size={25} />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity onPress={navigation.getParam("onPress")} style={styles.optionIcon}>
          <Icon.AntDesign color={Colors.darkGray} name="plus" size={14} />
          <Text color={Colors.darkGray} style={styles.optionText}>
            Option
          </Text>
        </TouchableOpacity>
      ),
    }
  }

  state = {
    numberOfOptions: 2,
    pending: false,
    question: null,
  }

  componentDidMount() {
    this.props.navigation.setParams({ onPress: this._onPress })
  }

  _onPress = () => {
    this.setState(state => ({ numberOfOptions: state.numberOfOptions + 1 }))
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
        const db = firebase.firestore()
        const profile = await db.collection("Users").doc(`${firebase.auth().currentUser.uid}`).get()
        const { currentTrip } = profile.data()
        await db
          .collection("Polls")
          .doc(`${currentTrip}`)
          .collection("polls")
          .doc(uuidV4())
          .set({
            createdAt: (new Date()).toISOString(),
            question: question.includes("?") ? question : question + "?",
            options: options.map((option, index) => ({
                id: uuidV4(),
                option: this.state[`${index + 1}`],
                votes: [],
              })
            ),
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
                <KeyboardAwareScrollView
                  enableOnAndroid
                  enableResetScrollToCoords={false}
                  keyboardDismissMode="on-drag"
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}
                >
                  <Headline>Make a poll for the trip</Headline>
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
                  <Button
                    onPress={this._createPoll}
                    pending={pending}
                    style={styles.createButton}
                  >
                    <Text>Create poll</Text>
                  </Button>
                </KeyboardAwareScrollView>
              </Flex>
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
    alignSelf: "center",
    backgroundColor: Colors.white,
    borderWidth: 2,
    marginVertical: 20,
    width: "50%",
  },
  container: {
    marginHorizontal: DEFAULT_PADDING,
  },
  headerIcon: {
    paddingHorizontal: DEFAULT_PADDING / 2,
  },
  optionIcon: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: DEFAULT_PADDING / 2,
  },
  optionText: {
    paddingLeft: 2,
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
