import React, { useCallback, useEffect, useState } from "react"
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native"
import { Subscribe } from "unstated"
import { useActionSheet } from '@expo/react-native-action-sheet'
import * as Icon from "@expo/vector-icons"
import firebase from "firebase"
import moment from "moment"

import EmptyListCard from "./common/EmptyListCard"
import Flex from "./common/Flex"
import Loader from "./common/Loader"
import Text from "./common/Text"

import ChatContainer from "../containers/ChatContainer"
import ItineraryContainer from "../containers/ItineraryContainer"
import PollsContainer from "../containers/PollsContainer"
import ProfileContainer from "../containers/ProfileContainer"
import SuggestionsContainer from "../containers/SuggestionsContainer"
import TripContainer from "../containers/TripContainer"
import UsersContainer from "../containers/UsersContainer"
import UsersTripsContainer from "../containers/UsersTripsContainer"

import { displayDates } from "../utils/dates"
import { removeUser } from "../utils/removeUser"
import { Colors, DEFAULT_PADDING } from "../constants/style"

const Trips = ({ currentTrip, refresh, trips }) => {
  const [loading, setLoading] = useState(true)
  const [tripList, setTripList] = useState([])
  const { showActionSheetWithOptions } = useActionSheet()

  useEffect(() => {
    if (trips.length) {
      const getTrips = async () => {
        const tripsRef = firebase.firestore().collection("Trips")
        const tripsList = await Promise.all(
          trips.map(async trip => {
            const doc = await tripsRef.doc(trip).get()
            return { id: trip, ...doc.data() }
          })
        )
        setTripList(tripsList)
        setLoading(false)
      }
      getTrips()
    } else {
      setLoading(false)
    }
  }, [trips])

  const onPress = useCallback(async tripId => {
    await firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .update({ currentTrip: tripId })
    refresh()
  }, [])

  const renderItem = useCallback(({ item }) => {
    return (
      <View style={styles.listItem}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => onPress(item.id)}
          onLongPress={() => {
            showActionSheetWithOptions({
              options: ['Leave', 'Cancel'],
              cancelButtonIndex: 1,
              destructiveButtonIndex: 0,
            },
              buttonIndex => buttonIndex === 0 && removeUser(firebase.auth().currentUser.uid, item.id)
            )
          }}
        >
          <View>
            <Text size="large">{item.location}</Text>
            <Text size="small">
              {displayDates({ startDate: item.startDate, endDate: item.endDate })}
            </Text>
          </View>
          {item.id === currentTrip && (
            <Icon.Feather color={Colors.darkGray} name="check" size={25} />
          )}
        </TouchableOpacity>
      </View>
    )
  }, [])

  return (
    <Flex>
      {loading ? (
        <Loader />
      ) : (
        <FlatList
          contentContainerStyle={styles.container}
          data={tripList}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListEmptyComponent={(
            <EmptyListCard
              title="No Trips"
              description="All your trips will appear here"
            />
          )}
        />
      )}
    </Flex>
  )
}

const TripsConainer = () => {
  return (
    <Subscribe
      to={[
        ChatContainer,
        ItineraryContainer,
        PollsContainer,
        ProfileContainer,
        SuggestionsContainer,
        TripContainer,
        UsersContainer,
        UsersTripsContainer
      ]}
    >
      {(chatContainer,
        itineraryContainer,
        pollsContainer,
        profileContainer,
        suggestionsContainer,
        tripContainer,
        usersContainer,
        usersTripsContainer
      ) => (
        <Trips
          currentTrip={profileContainer.state.profile.currentTrip}
          trips={usersTripsContainer.state.usersTrips}
          refresh={() => {
            chatContainer._refreshChat()
            itineraryContainer._refreshItinerary()
            pollsContainer._refreshPolls()
            profileContainer._refreshProfile()
            suggestionsContainer._refreshSuggestions()
            tripContainer._refreshTrips()
            usersContainer._refreshUsers()
          }}
        />
      )}
    </Subscribe>
  )
}

TripsConainer.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: "My Trips",
    headerLeft: (
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
        <Icon.AntDesign color={Colors.darkGray} name="left" size={25} />
      </TouchableOpacity>
    ),
  }
}

export default TripsConainer

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: DEFAULT_PADDING,
  },
  headerIcon: {
    paddingHorizontal: DEFAULT_PADDING / 2,
  },
  listItem: {
    borderBottomWidth: 1,
    borderColor: Colors.lightGray,
    paddingHorizontal: 5,
    paddingVertical: DEFAULT_PADDING,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
})
