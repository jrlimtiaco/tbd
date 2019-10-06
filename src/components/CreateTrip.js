import React, { Component } from "react"
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native"

import Button from "./common/Button"
import Calendar from "./Calendar"
import Flex from "./common/Flex"
import Icon from "@expo/vector-icons"
import LocationPicker from "./LocationPicker"
import Text from "./common/Text"

import ProfileContainer from "../containers/ProfileContainer"
import TripContainer from "../containers/TripContainer"
import { Subscribe } from "unstated"

import firebase from "firebase"
import { TRIP } from "../constants/routes"
import { displayDates, getTripDates } from "../utils/dates"

import { Colors, Fonts } from "../constants/style"
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../constants/dimensions"

class CreateTrip extends Component {
  static navigationOptions = {
    header: null,
  }

  state = {
    displayCalendar: false,
    displayLocationPicker: false,
    endDate: null,
    location: null,
    startDate: null,
  }

  _createTrip = async ({ refreshProfile, refreshTrips, trips }) => {
    const { navigation } = this.props
    const { endDate, location, startDate } = this.state
    if (!endDate || !location || !startDate) {
      Alert.alert("Error", "You must select a destination and pick dates to create a trip.")
    } else {
      try {
        this.setState({ pending: true })
        const itinerary = getTripDates({ startDate, endDate }).reduce((acc, cur) => {
          acc[cur] = {}
          return acc
        }, {})
        const db = firebase.firestore()
        const newTripRef = await db.collection("Trips").doc()
        await db.collection("Users")
          .doc(`${firebase.auth().currentUser.uid}`)
          .update({
            currentTrip: newTripRef.id,
            trips: [...trips, newTripRef.id],
          })
        await newTripRef.set({
          endDate,
          itinerary,
          location,
          startDate,
          tripName: null,
          tripItems: [],
        })
        refreshProfile()
        refreshTrips()
        Alert.alert("Trip Created", "You successfully created your trip.")
        navigation.navigate(TRIP)
      } catch (err) {
        this.setState({ pending: false })
        Alert.alert("Error", err.message)
      }
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
      <Subscribe to={[ProfileContainer, TripContainer]}>
        {(profileContainer, tripContainer) => {
          const { _refreshProfile: refreshProfile } = profileContainer
          const { _refreshTrips: refreshTrips } = tripContainer
          const { trips } = profileContainer.state.profile
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
                <Button
                  pending={pending}
                  style={styles.createButton}
                  transparent
                  onPress={() => this._createTrip({ refreshProfile, refreshTrips, trips })}
                >
                  <Text>
                    Create
                  </Text>
                </Button>
              </View>
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

export default CreateTrip

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
  },
  createButton: {
    alignSelf: "center",
    borderWidth: 2,
    marginTop: 30,
    width: DEVICE_WIDTH / 2,
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
