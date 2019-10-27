import React, { Component } from "react"
import { Alert, StyleSheet, TouchableOpacity } from "react-native"
import { Subscribe } from "unstated"
import * as Icon from "@expo/vector-icons"
import firebase from "firebase"
import moment from "moment"
import uuidV4 from "uuid/v4"

import Button from "./common/Button"
import DateTimePicker from "react-native-modal-datetime-picker"
import Flex from "./common/Flex"
import Headline from "./common/Headline"
import Input from "./common/Input"
import Text from "./common/Text"

import ProfileContainer from "../containers/ProfileContainer"
import TripContainer from "../containers/TripContainer"

import { DEVICE_WIDTH } from "../constants/dimensions"
import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"

class AddItineraryItem extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
        <Icon.AntDesign color={Colors.darkGray} name="left" size={25} />
      </TouchableOpacity>
    ),
  })

  state = {
    event: null,
    displayTimePicker: false,
    pending: false,
    selectedDate: this.props.navigation.getParam("selectedDate"),
    startTime: null,
  }

  _onPress = async () => {
    const { navigation } = this.props
    const { event, selectedDate: date, startTime } = this.state
    if (!event || !startTime) {
      this._event.validate()
      this._startTime.validate()
      return
    } else {
      try {
        this.setState({ pending: true })
        await firebase.firestore()
          .collection("Itineraries")
          .doc(`${this._currenTrip}`)
          .collection("itineraries")
          .doc(uuidV4())
          .set({
            date,
            event,
            startTime,
          })
        navigation.goBack()
      } catch (err) {
        this.setState({ pending: false })
        Alert.alert("Error", "Unable to add event to itinerary. Please try again.")
        console.log("## _onPress err:", err)
      }
    }
  }

  render() {
    return (
      <Subscribe to={[ProfileContainer, TripContainer]}>
        {(profileContainer, tripContainer) => {
          this._currenTrip = profileContainer.state.profile.currentTrip
          this._itinerary = tripContainer.state.trip.itinerary
          return (
            <Flex>
              <Flex style={styles.container}>
                <Headline>Add an event to your itinerary</Headline>
                <Text>EVENT</Text>
                <Input
                  ref={ref => (this._event = ref)}
                  id="event"
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoFocus
                  clearButtonMode="while-editing"
                  containerStyle={styles.textInputContainer}
                  maxLength={25}
                  onChangeText={event => this.setState({ event })}
                  onSubmitEditing={() => this.setState({ displayTimePicker: true })}
                  placeholder={"Enter event"}
                  placeholderTextColor={Colors.lightGray}
                  required
                  returnKeyType="next"
                  style={styles.textInput}
                  underlineColorAndroid="transparent"
                  value={this.state.event}
                />
                <Text>START TIME</Text>
                <TouchableOpacity
                  onPress={() => {
                    if (this._event) this._event.blur()
                    this.setState({ displayTimePicker: true })
                  }}
                >
                  <Input
                    ref={ref => (this._startTime = ref)}
                    id="start time"
                    editable={false}
                    containerStyle={styles.textInputContainer}
                    placeholder={"Enter start time"}
                    placeholderTextColor={Colors.lightGray}
                    pointerEvents="none"
                    required
                    style={styles.textInput}
                    underlineColorAndroid="transparent"
                    value={this.state.startTime}
                  />
                </TouchableOpacity>
                <Button
                  onPress={this._onPress}
                  pending={this.state.pending}
                  style={styles.button}
                >
                  <Text>Add to itinerary</Text>
                </Button>
                <DateTimePicker
                  is24Hour={false}
                  isVisible={this.state.displayTimePicker}
                  minuteInterval={5}
                  mode="time"
                  onCancel={() => this.setState({ displayTimePicker: false })}
                  onConfirm={time => this.setState({ displayTimePicker: false, startTime: moment(time).format("hh:mm a") })}
                  titleIOS=""
                />
              </Flex>
            </Flex>
          )
        }}
      </Subscribe>
    )
  }
}

export default AddItineraryItem

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
    backgroundColor: Colors.white,
    borderWidth: 2,
    marginVertical: 20,
    width: DEVICE_WIDTH / 2,
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
