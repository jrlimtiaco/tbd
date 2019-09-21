import React from 'react'
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'

import Flex from "./common/Flex"
import Text from "./common/Text"

import firebase from "firebase"
import { connectActionSheet } from '@expo/react-native-action-sheet'

import { CREATE_TRIP } from '../constants/routes'
import { Fonts } from "../constants/style"

@connectActionSheet
export default class LinksScreen extends React.Component {
  static navigationOptions = {
    headerTitle: 'Account',
  };

  _signOut = () => {
    this.props.showActionSheetWithOptions({
      options: ['Sign out', 'Cancel'],
      cancelButtonIndex: 1,
    },
      buttonIndex => buttonIndex === 0 && firebase.auth().signOut()
    )
  }

  render() {
    return (
      <Flex>
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity
            onPress={this._signOut}
            style={styles.listItem}
          >
            <Text>
              Sign out
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate(CREATE_TRIP)}
            style={styles.listItem}
          >
            <Text>
              Create Trip
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Flex>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 15,
  },
  listItem: {
    paddingVertical: 15,
  },
});
