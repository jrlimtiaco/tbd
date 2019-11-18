import React from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { connectActionSheet } from '@expo/react-native-action-sheet'
import * as Icon from "@expo/vector-icons"
import firebase from "firebase"

import Flex from "./common/Flex"
import Text from "./common/Text"
import { InviteCountMenu } from "./InviteCount"

import { CREATE_TRIP, INVITES, TRIPS } from '../constants/routes'
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
    const { navigation, showActionSheetWithOptions } = this.props
    let onPress
    switch (id) {
      case CREATE_TRIP_ID:
        onPress = () => {
          navigation.navigate(CREATE_TRIP)
        }
        break
      case INVITES_ID:
        onPress = () => {
          navigation.navigate(INVITES)
        }
        break
      case TRIPS_ID:
        onPress = () => {
          navigation.navigate(TRIPS)
        }
        break
      default:
        onPress = () => {
          showActionSheetWithOptions({
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
      <View style={styles.item}>
        <TouchableOpacity
          onPress={this._getOnPress(item.id)}
          style={styles.listItem}
        >
          <Text>{item.label}</Text>
          <Icon.Feather name={item.icon} size={25} />
        </TouchableOpacity>
        {item.id === INVITES_ID && <InviteCountMenu />}
      </View>
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
  container: {
    paddingHorizontal: DEFAULT_PADDING,
  },
  item: {
    borderColor: Colors.lightGray,
    borderBottomWidth: 1,
  },
  listItem: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: DEFAULT_PADDING,
  },
});
