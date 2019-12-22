import React, { useCallback, useEffect, useState } from "react"
import { FlatList, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { Subscribe } from "unstated"
import { startCase } from "lodash"
import { useActionSheet } from '@expo/react-native-action-sheet'
import * as Icon from "@expo/vector-icons"
import firebase from "firebase"

import Flex from "./common/Flex"
import Text from "./common/Text"

import ProfileContainer from "../containers/ProfileContainer"
import TripContainer from "../containers/TripContainer"

import { Colors, DEFAULT_PADDING } from "../constants/style"
import { removeUser } from "../utils/removeUser"

const UserList = ({ tripId, users }) => {
  const [userList, setUserList] = useState([])
  const { showActionSheetWithOptions } = useActionSheet()

  useEffect(() => {
    const getUsersDetails = async () => {
      const usersDetails = await Promise.all(users.map(async user => {
        const userDetails = await firebase
          .firestore()
          .collection("Users")
          .doc(user)
          .get()
        return { ...userDetails.data(), id: userDetails.id }
      }))
      setUserList(usersDetails)
    }
    getUsersDetails()
  }, [users])

  const renderItem = useCallback(({ item }) => {
    return (
      <TouchableWithoutFeedback
        onLongPress={() => {
          showActionSheetWithOptions({
            options: ['Remove', 'Cancel'],
            cancelButtonIndex: 1,
            destructiveButtonIndex: 0,
          },
            buttonIndex => buttonIndex === 0 && removeUser(item.id, tripId)
          )
        }}
      >
        <View style={styles.item}>
          <Icon.Feather name="user" size={25} />
          <View style={styles.itemText}>
            <Text>
              {startCase(item.firstName)} {startCase(item.lastName)}
            </Text>
            <Text color={Colors.darkGray} size="small">
              {item.email.toLowerCase()}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }, [])

  return (
    <Flex>
      <Flex style={styles.container}>
        <FlatList
          data={userList}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      </Flex>
    </Flex>
  )
}

const UserListContainer = () => {
  return (
    <Subscribe to={[ProfileContainer, TripContainer]}>
      {(profileContainer, tripContainer) => (
        <UserList
          tripId={profileContainer.state.profile.currentTrip}
          users={tripContainer.state.trip.users}
        />
      )}
    </Subscribe>
  )
}

UserListContainer.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: "Travelers",
    headerLeft: (
      <TouchableOpacity
        style={styles.headerIcon}
        onPress={() => navigation.goBack()}
      >
        <Icon.AntDesign color={Colors.darkGray} name="left" size={25} />
      </TouchableOpacity>
    ),
  }
}

export default UserListContainer

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
  },
  headerIcon: {
    paddingHorizontal: DEFAULT_PADDING / 2,
  },
  item: {
    alignItems: "center",
    borderColor: Colors.lightGray,
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingVertical: DEFAULT_PADDING,
  },
  itemText: {
    paddingHorizontal: DEFAULT_PADDING,
  },
})
