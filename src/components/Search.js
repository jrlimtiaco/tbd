import React, { useCallback, useEffect, useState } from "react"
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { Subscribe } from "unstated"
import * as Icon from "@expo/vector-icons"
import firebase from "firebase"

import Flex from "./common/Flex"
import Headline from "./common/Headline"
import Text from "./common/Text"

import TripContainer from "../containers/TripContainer"

import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"
import { formatCollection } from "../utils/collection"

const Search = ({ navigation, users }) => {
  const [selectedUsers, setSelectedUsers] = useState(users || [])
  const [results, setResults] = useState([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    navigation.setParams({ selectedUsers })
    const searchUsers = () => {
      firebase
        .firestore()
        .collection("Users")
        .get()
        .then(querySnapshot => {
          setResults(formatCollection(querySnapshot))
        })
    }
    searchUsers()
  }, [])

  const onPress = useCallback((userId) => {
    const updatedUsers = selectedUsers.includes(userId)
      ? selectedUsers.filter(selectedUser => selectedUser !== userId)
      : [...selectedUsers, userId]
    setSelectedUsers(updatedUsers)
    navigation.setParams({ selectedUsers: updatedUsers })
  }, [selectedUsers])

  const renderItem = useCallback(({ item, index }) => {
    const isSelected = selectedUsers.includes(item.id)
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => onPress(item.id)} style={styles.itemRow}>
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
          {isSelected && <Icon.Feather name="check" size={25} />}
        </TouchableOpacity>
      </View>
    )
  }, [selectedUsers])

  return (
    <Flex>
      <Flex style={styles.container}>
        <Headline>Search & Invite</Headline>
        <TextInput
          autoCapitalize="words"
          autoCorrect={false}
          autoFocus
          clearButtonMode="while-editing"
          maxLength={25}
          onChangeText={search => setSearch(search)}
          placeholder="Search name or email"
          placeholderTextColor={Colors.gray}
          returnKeyType="done"
          style={styles.textInput}
          underlineColorAndroid="transparent"
          value={search}
        />
        <FlatList
          keyboardDismissMode="on-drag"
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          data={search
            ? results.filter(result =>
                result.email.toLowerCase().includes(search.toLowerCase()) ||
                result.firstName.toLowerCase().includes(search.toLowerCase()) ||
                result.lastName.toLowerCase().includes(search.toLowerCase())
              )
            : []
          }
        />
      </Flex>
    </Flex>
  )
}

const SearchContainer = ({ navigation }) => {
  return (
    <Subscribe to={[TripContainer]}>
      {tripContainer => (
        <Search
          navigation={navigation}
          users={navigation.getParam("isNewTrip", false)
            ? []
            : tripContainer.state.trip.users
          }
        />
      )}
    </Subscribe>
  )
}

SearchContainer.navigationOptions = ({ navigation }) => {
  return {
    headerLeft: (
      <TouchableOpacity
        style={styles.headerIcon}
        onPress={() => {
          const setUsers = navigation.getParam("setUsers")
          if (setUsers) {
            setUsers(navigation.getParam("selectedUsers"))
          }
          navigation.goBack()
        }}
      >
        <Icon.AntDesign color={Colors.darkGray} name="left" size={25} />
      </TouchableOpacity>
    ),
  }
}

export default SearchContainer

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
  },
  headerIcon: {
    paddingHorizontal: DEFAULT_PADDING / 2,
  },
  item: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: DEFAULT_PADDING,
  },
  itemContainer: {
    borderColor: Colors.lightGray,
    borderBottomWidth: 1,
  },
  itemRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemText: {
    paddingHorizontal: DEFAULT_PADDING,
  },
  textInput: {
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 1,
    fontFamily: Fonts.CerealExtraBold,
    fontSize: 20,
    paddingVertical: 10,
  },
})
