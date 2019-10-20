import React from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { connectActionSheet } from '@expo/react-native-action-sheet'
import * as Icon from "@expo/vector-icons"
import firebase from "firebase"

import Flex from "./common/Flex"
import Text from "./common/Text"

import { CREATE_TRIP } from '../constants/routes'
import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"

const CREATE_TRIP_ID = "CREATE_TRIP_ID"
const INVITES_ID = "INVITES_ID"
const SIGN_OUT_ID = "SIGN_OUT_ID"
const TRIPS_ID = "TRIPS_ID"

const accountOptions = [
  {
    id: CREATE_TRIP_ID,
    icon: 'plus-circle',
    label: "New Trip",
  },
  {
    id: INVITES_ID,
    icon: 'inbox',
    label: "My Invites",
  },
  {
    id: TRIPS_ID,
    icon: 'list',
    label: "My Trips",
  },
  {
    id: SIGN_OUT_ID,
    icon: 'log-out',
    label: "Sign Out",
  },
]

@connectActionSheet
export default class LinksScreen extends React.Component {
  static navigationOptions = {
    headerTitle: 'Account',
  }

  _getOnPress = (id) => {
    let onPress
    switch (id) {
      case CREATE_TRIP_ID:
        onPress = () => {
          this.props.navigation.navigate(CREATE_TRIP)
        }
        break
      default:
        onPress = () => {
          this.props.showActionSheetWithOptions({
            options: ['Sign out', 'Cancel'],
            cancelButtonIndex: 1,
          },
            buttonIndex => buttonIndex === 0 && firebase.auth().signOut()
          )
        }
    }
    return onPress
  }

  _renderItem = ({ item }) => {
    return (
      <>
        <TouchableOpacity
          onPress={this._getOnPress(item.id)}
          style={styles.listItem}
        >
          <Text>{item.label}</Text>
          <Icon.Feather name={item.icon} size={25} />
        </TouchableOpacity>
        <View style={styles.border} />
      </>
    )
  }

  render() {
    return (
      <Flex>
        <FlatList
          contentContainerStyle={styles.container}
          data={accountOptions}
          keyExtractor={item => item.id}
          renderItem={this._renderItem}
        />
      </Flex>
    );
  }
}

const styles = StyleSheet.create({
  border: {
    backgroundColor: Colors.lightGray,
    height: 1,
  },
  container: {
    paddingHorizontal: DEFAULT_PADDING,
  },
  listItem: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: DEFAULT_PADDING,
  },
});
