import React, { useCallback, useEffect, useState } from "react"
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import * as Icon from "@expo/vector-icons"
import firebase from "firebase"

import Flex from "./common/Flex"
import Headline from "./common/Headline"
import Text from "./common/Text"

import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"
import { formatCollection } from "../utils/collection"

const Search = () => {
  const [results, setResults] = useState([])
  const [search, setSearch] = useState("")

  useEffect(() => {
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

  const renderItem = useCallback(({ item, index }) => {
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => null} style={styles.item}>
          <Icon.Feather name="user" size={25} />
          <View style={styles.itemText}>
            <Text size="small">{item.email}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  })

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
          data={search
            ? results.filter(result => result.email.toLowerCase().includes(search.toLowerCase()))
            : []
          }
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
  item: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: DEFAULT_PADDING,
  },
  itemContainer: {
    borderColor: Colors.lightGray,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
