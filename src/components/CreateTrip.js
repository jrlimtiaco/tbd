import React, { Component } from "react"
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native"
import { Subscribe } from "unstated"
import firebase from "firebase"

import * as Icon from "@expo/vector-icons"
import Button from "./common/Button"
import Flex from "./common/Flex"
import Text from "./common/Text"

import ChatContainer from "../containers/ChatContainer"
import ItineraryContainer from "../containers/ItineraryContainer"
import PollsContainer from "../containers/PollsContainer"
import ProfileContainer from "../containers/ProfileContainer"
import SuggestionsContainer from "../containers/SuggestionsContainer"
import TripContainer from "../containers/TripContainer"
import UsersContainer from "../containers/UsersContainer"

import { displayDates, getTripDates } from "../utils/dates"
import { CALENDAR, LOCATION, SEARCH, TRIP } from "../constants/routes"
import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../constants/dimensions"

class CreateTrip extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Create Trip",
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Icon.AntDesign color={Colors.darkGray} name="left" size={25} />
        </TouchableOpacity>
      ),
    }
  }

  state = {
    endDate: null,
    location: null,
    startDate: null,
    users: [],
  }

  _createTrip = async ({ refresh }) => {
    const { navigation } = this.props
    const { endDate, location, startDate, users } = this.state
    if (!endDate || !location || !startDate) {
      Alert.alert("Error", "You must select a destination and pick dates to create a trip.")
    } else {
      try {
        this.setState({ pending: true })
        const db = firebase.firestore()
        const newTripRef = await db.collection("Trips").doc()
        await db.collection("Users")
          .doc(firebase.auth().currentUser.uid)
          .update({
            currentTrip: newTripRef.id,
          })
        await newTripRef.set({
          endDate,
          location,
          startDate,
          tripName: null,
          tripItems: [],
          users: [firebase.auth().currentUser.uid],
        })
        refresh()
        await db.collection("UsersTrips")
          .doc(firebase.auth().currentUser.uid)
          .collection("usersTrips")
          .doc(newTripRef.id)
          .set({})
        await Promise.all(users.map(async user =>
          await db
            .collection("Invites")
            .doc(user)
            .collection("invites")
            .doc(newTripRef.id)
            .set({})
        ))
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
      <View style={styles.item}>
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          this.props.navigation.navigate(LOCATION, {
            selectLocation: location => this.setState({ location })
          })
        }}
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
      </View>
    )
  }

  _renderStartAndEndDate = () => {
    const { endDate, startDate } = this.state
    return (
      <View style={styles.item}>
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          this.props.navigation.navigate(CALENDAR, {
            selectDates: ({ endDate, startDate }) => this.setState({ endDate, startDate })
          })
        }}
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
      </View>
    )
  }

  _renderUsers = () => {
    const { users } = this.state
    return (
      <View style={styles.item}>
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          this.props.navigation.navigate(SEARCH, {
            isNewTrip: true,
            setUsers: users => this.setState({ users })
          })
        }}
      >
        <Text size="xxlarge" type={Fonts.CerealExtraBold}>
          Who
        </Text>
        {users.length ? (
          <Text size="large" type={Fonts.CerealBold}>
            {`${users.length} Travelers`}
          </Text>
        ) : (
          <Icon.Feather
            name="chevron-right"
            size={30}
          />
        )}
      </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Subscribe
        to={[
          ChatContainer,
          ItineraryContainer,
          PollsContainer,
          ProfileContainer,
          SuggestionsContainer,
          TripContainer,
          UsersContainer
        ]}
      >
        {(
          chatContainer,
          itineraryContainer,
          pollsContainer,
          profileContainer,
          suggestionsContainer,
          tripContainer,
          usersContainer
        ) => {
          return (
            <Flex>
              <View style={styles.container}>
                {this._renderLocation()}
                {this._renderStartAndEndDate()}
                {this._renderUsers()}
                <Button
                  pending={this.state.pending}
                  style={styles.createButton}
                  transparent
                  onPress={() => {
                    this._createTrip({
                      refresh: () => {
                        chatContainer._refreshChat()
                        itineraryContainer._refreshItinerary()
                        pollsContainer._refreshPolls()
                        profileContainer._refreshProfile()
                        suggestionsContainer._refreshSuggestions()
                        tripContainer._refreshTrips()
                        usersContainer._refreshUsers()
                      },
                    })
                  }}
                >
                  <Text>Create</Text>
                </Button>
              </View>
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
  headerIcon: {
    paddingHorizontal: DEFAULT_PADDING / 2,
  },
  item: {
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 1,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 15,
    paddingTop: 30,
  },
})
