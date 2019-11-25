import React, { useCallback, useEffect, useState } from "react"
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native"
import { Subscribe } from "unstated"
import * as Icon from "@expo/vector-icons"
import firebase from "firebase"

import EmptyListCard from "./common/EmptyListCard"
import Flex from "./common/Flex"
import Text from "./common/Text"

import ChatContainer from "../containers/ChatContainer"
import InvitesContainer from "../containers/InvitesContainer"
import ItineraryContainer from "../containers/ItineraryContainer"
import PollsContainer from "../containers/PollsContainer"
import ProfileContainer from "../containers/ProfileContainer"
import SuggestionsContainer from "../containers/SuggestionsContainer"
import TripContainer from "../containers/TripContainer"
import UsersContainer from "../containers/UsersContainer"

import { Colors, DEFAULT_PADDING } from "../constants/style"
import { displayDates } from "../utils/dates"

const Invites = ({ inviteList, navigation, refresh }) => {
  const [invites, setInvites] = useState([])

  useEffect(() => {
    const getInvites = async () => {
      const myInvites = await Promise.all(
        inviteList.map(async invite => {
          const inviteDetails = await firebase
            .firestore()
            .collection("Trips")
            .doc(invite)
            .get()
          return {
            ...inviteDetails.data(),
            id: invite,
          }
        })
      )
      setInvites(myInvites)
    }
    getInvites()
  }, [inviteList])

  const deleteInvite = useCallback(async (tripId) => {
    await firebase
      .firestore()
      .collection("Invites")
      .doc(firebase.auth().currentUser.uid)
      .collection("invites")
      .doc(tripId)
      .delete()
  }, [])

  const acceptInvite = useCallback(async (tripId) => {
    const tripRef = firebase
      .firestore()
      .collection("Trips")
      .doc(tripId)
    const { users } = (await tripRef.get()).data()
    await tripRef.update({ users: [...users, firebase.auth().currentUser.uid] })
    await firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .update({ currentTrip: tripId })
    refresh()
    await firebase
      .firestore()
      .collection("UsersTrips")
      .doc(firebase.auth().currentUser.uid)
      .collection("usersTrips")
      .doc(tripId)
      .set({})
    await deleteInvite(tripId)
    navigation.goBack()
  }, [navigation, refresh])

  const renderItem = useCallback(({ item, index }) => {
    const { id, endDate, location, startDate } = item
    return (
      <View style={styles.item}>
        <View>
          <Text size="large">{location}</Text>
          <Text size="small">{displayDates({ startDate, endDate })}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => acceptInvite(id)} style={styles.button}>
            <Text size="small">Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteInvite(id)} style={styles.button}>
            <Text size="small">Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  })

  return (
    <Flex>
      <FlatList
        contentContainerStyle={styles.container}
        data={invites}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={(
          <EmptyListCard
            title="No Invites"
            description="All your invitations will appear here"
          />
        )}
      />
    </Flex>
  )
}

const InvitesList = ({ navigation }) => {
  return (
    <Subscribe
      to={[
        ChatContainer,
        InvitesContainer,
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
        invitesContainer,
        itineraryContainer,
        pollsContainer,
        profileContainer,
        suggestionsContainer,
        tripContainer,
        usersContainer
      ) => (
        <Invites
          inviteList={invitesContainer.state.invites}
          navigation={navigation}
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

InvitesList.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: "My Invites",
    headerLeft: (
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
        <Icon.AntDesign color={Colors.darkGray} name="left" size={25} />
      </TouchableOpacity>
    ),
  }
}

export default InvitesList

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderColor: Colors.darkGray,
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    marginHorizontal: 5,
    padding: 7,
  },
  buttonContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  container: {
    paddingHorizontal: DEFAULT_PADDING,
  },
  headerIcon: {
    paddingHorizontal: DEFAULT_PADDING / 2,
  },
  item: {
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightGray,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: DEFAULT_PADDING,
  },
})
