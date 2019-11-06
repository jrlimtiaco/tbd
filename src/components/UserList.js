import React, { useCallback, useEffect, useState } from "react"
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native"
import { Subscribe } from "unstated"
import * as Icon from "@expo/vector-icons"
import firebase from "firebase"

import Flex from "./common/Flex"
import Text from "./common/Text"

import TripContainer from "../containers/TripContainer"

import { Colors, DEFAULT_PADDING } from "../constants/style"

const UserList = ({ users }) => {
  const [userList, setUserList] = useState([])

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
  }, [])

  const renderItem = useCallback(({ item }) => {
    return (
      <View style={styles.item}>
        <Icon.Feather name="user" size={25} />
        <View style={styles.itemText}>
          <Text>
            {item.firstName} {item.lastName}
          </Text>
          <Text color={Colors.darkGray} size="small">
            {item.email}
          </Text>
        </View>
      </View>
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
    <Subscribe to={[TripContainer]}>
      {tripContainer => <UserList users={tripContainer.state.trip.users} />}
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    paddingVertical: DEFAULT_PADDING,
  },
  itemText: {
    paddingHorizontal: DEFAULT_PADDING,
  },
})