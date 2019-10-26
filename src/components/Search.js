import React, { useEffect, useState } from "react"
import { StyleSheet, TextInput, TouchableOpacity } from "react-native"
import * as Icon from "@expo/vector-icons"
import firebase from "firebase"

import Flex from "./common/Flex"
import Headline from "./common/Headline"
import Text from "./common/Text"

import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"
import { formatCollection } from "../utils/collection"

const Search = () => {
  const [results, setResults] = useState([])
  const [search, setSearch] = useState(null)

  useEffect(() => {
    if (search) {
      const searchUsers = async () => {
        await firebase
          .firestore()
          .collection("Users")
          .where("email", "==", search)
          .get()
          .then(querySnapshot => {
            const results = formatCollection(querySnapshot)
            setResults(results)
          })
      }
      searchUsers()
    }
  }, [search])

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
      </Flex>
    </Flex>
  )
}

Search.navigationOptions = ({ navigation }) => {
  return {
    headerLeft: (
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
        <Icon.AntDesign color={Colors.darkGray} name="left" size={25} />
      </TouchableOpacity>
    ),
  }
}

export default Search

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
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
})
