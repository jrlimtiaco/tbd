import React, { Component } from "react"
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native"

import * as Icon from "@expo/vector-icons"
import Button from "./common/Button"
import Calendar from "./Calendar"
import Flex from "./common/Flex"
import LocationPicker from "./LocationPicker"
import Text from "./common/Text"

import ProfileContainer from "../containers/ProfileContainer"
import { Subscribe } from "unstated"

import firebase from "firebase"
import { TRIP } from "../constants/routes"
import { displayDates } from "../utils/dates"

import { Colors, Fonts } from "../constants/style"
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../constants/dimensions"

class EditTrip extends Component {
  static navigationOptions = {
    header: null,
  }

  state = {
    displayCalendar: false,
    displayLocationPicker: false,
    endDate: this.props.navigation.getParam("endDate", null),
    location: this.props.navigation.getParam("location", null),
    startDate: this.props.navigation.getParam("startDate", null),
  }

  _updateTrip = async ({ currentTrip }) => {
    const { navigation } = this.props
    const { endDate, location, startDate } = this.state
    try {
      this.setState({ pending: true })
      await firebase.firestore()
        .collection("Trips")
        .doc(currentTrip)
        .update({ endDate, location, startDate })
      Alert.alert("Trip Updated", "You successfully updated your trip.")
      navigation.navigate(TRIP)
    } catch (err) {
      this.setState({ pending: false })
      Alert.alert("Error", "Unable to save changes. Please try again.")
    }
  }

  _renderLocation = () => {
    const { location } = this.state
    return (
      <TouchableOpacity
        onPress={() => this.setState({ displayLocationPicker: true })}
        style={styles.row}
      >
        <Text size="xxlarge" type={Fonts.CerealExtraBold}>
          Where
        </Text>
        {location ? (
          <Text size="large" type={Fonts.CerealBold}>
            {location}
          </Text>
        ) : (
          <Icon.Feather
            name="chevron-right"
            size={30}
          />
        )}
      </TouchableOpacity>
    )
  }

  _renderStartAndEndDate = () => {
    const { endDate, startDate } = this.state
    return (
      <TouchableOpacity
        onPress={() => this.setState({ displayCalendar: true })}
        style={styles.row}
      >
        <Text size="xxlarge" type={Fonts.CerealExtraBold}>
          When
        </Text>
        {startDate && endDate ? (
          <Text size="large" type={Fonts.CerealBold}>
            {displayDates({ startDate, endDate })}
          </Text>
        ) : (
          <Icon.Feather
            name="chevron-right"
            size={30}
          />
        )}
      </TouchableOpacity>
    )
  }

  render() {
    const {
      endDate,
      displayCalendar,
      displayLocationPicker,
      location,
      pending,
      startDate,
    } = this.state
    return (
      <Subscribe to={[ProfileContainer]}>
        {(profileContainer) => {
          const { _refreshProfile: refreshProfile } = profileContainer
          const { currentTrip, trips } = profileContainer.state.profile
          return (
            <Flex>
              <View style={styles.container}>
                <Text color={Colors.darkGray} size="xxxxxlarge" type={Fonts.CerealExtraBold} style={styles.heading}>
                  Travel Details
                </Text>
                {this._renderLocation()}
                <View style={styles.separator} />
                {this._renderStartAndEndDate()}
                <View style={styles.separator} />
                <TouchableOpacity style={styles.row}>
                  <Text size="xxlarge" type={Fonts.CerealExtraBold}>
                    Who
                  </Text>
                  <Icon.Feather name="chevron-right" size={30} />
                </TouchableOpacity>
                <View style={styles.separator} />
              </View>
              <Button
                pending={pending}
                style={styles.createButton}
                transparent
                onPress={() => this._updateTrip({ currentTrip })}
              >
                <Text>
                  Save
                </Text>
              </Button>
              <LocationPicker
                onClose={() => this.setState({ displayLocationPicker: false })}
                selectLocation={location => this.setState({ location })}
                visible={displayLocationPicker}
              />
              <Calendar
                onClose={() => this.setState({ displayCalendar: false })}
                selectDates={({ endDate, startDate }) => this.setState({ endDate, startDate })}
                visible={displayCalendar}
              />
            </Flex>
          )
        }}
      </Subscribe>
    )
  }
}

export default EditTrip

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
  createButton: {
    borderWidth: 2,
    marginHorizontal: 40,
  },
  heading: {
    paddingTop: 20,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 15,
    paddingTop: 30,
  },
  separator: {
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 1,
  },
})
