import React, { Component } from "react"
import { Alert, FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { Subscribe } from "unstated"
import firebase from "firebase"

import * as Icon from "@expo/vector-icons"
import AddTripItem from "./AddTripItem"
import Flex from "./common/Flex"
import EmptyListCard from "./common/EmptyListCard"
import Text from "./common/Text"

import ProfileContainer from "../containers/ProfileContainer"
import TripContainer from "../containers/TripContainer"

import { DEVICE_HEIGHT } from "../constants/dimensions"
import { ADD_CHECKLIST_ITEM } from "../constants/routes"
import { Colors, Fonts, DEFAULT_PADDING } from "../constants/style"

class Checklist extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Checklist",
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Icon.AntDesign color={Colors.darkGray} name="left" size={25} />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity onPress={() => navigation.navigate(ADD_CHECKLIST_ITEM)} style={styles.headerIcon}>
          <Icon.AntDesign color={Colors.darkGray} name="plus" size={25} />
        </TouchableOpacity>
      ),
    }
  }

  _currentTrip
  _tripItems

  _deleteItem = async (tripItem) => {
    if (!this._currentTrip || !this._tripItems) return
    try {
      await firebase.firestore()
        .collection("Trips")
        .doc(this._currentTrip)
        .update({
          tripItems: this._tripItems.filter(item => item !== tripItem)
        })
    } catch (err) {
      Alert.alert("Error", err.message)
    }
  }

  _renderItem = ({ item }) => {
    return (
      <View style={styles.tripItem}>
        <View style={styles.tripItemTextContainer}>
          <Icon.Feather color={Colors.darkGray} name="check" size={25} />
          <Text style={styles.tripItemText}>
            {item}
          </Text>
        </View>
        <TouchableOpacity onPress={() => this._deleteItem(item)}>
          <Icon.MaterialCommunityIcons name="delete-outline" size={25} />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Subscribe to={[TripContainer, ProfileContainer]}>
        {(tripContainer, profileContainer) => {
          this._currentTrip = profileContainer.state.profile.currentTrip
          this._tripItems = tripContainer.state.trip.tripItems
          return (
            <Flex>
              <View style={styles.container}>
                <FlatList
                  data={this._tripItems}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  renderItem={this._renderItem}
                  ListEmptyComponent={(
                    <EmptyListCard
                      title="No Items"
                      description="Create a list of items everyone should bring."
                    />
                  )}
                />
              </View>
            </Flex>
          )
        }}
      </Subscribe>
    )
  }
}

export default Checklist

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: DEFAULT_PADDING,
  },
  headerIcon: {
    paddingHorizontal: DEFAULT_PADDING / 2,
  },
  text: {
    paddingVertical: DEFAULT_PADDING,
  },
  tripItem: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: Colors.lightGray,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: DEFAULT_PADDING,
  },
  tripItemText: {
    paddingLeft: 10,
  },
  tripItemTextContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
})
