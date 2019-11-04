import React, { Component } from "react"
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native"
import { Subscribe } from "unstated"
import firebase from "firebase"

import * as Icon from "@expo/vector-icons"
import Button from "./common/Button"
import Flex from "./common/Flex"
import Text from "./common/Text"

import ProfileContainer from "../containers/ProfileContainer"

import { displayDates } from "../utils/dates"
import { CALENDAR, LOCATION, SEARCH, TRIP } from "../constants/routes"
import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../constants/dimensions"

class EditTrip extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Edit Trip",
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Icon.AntDesign color={Colors.darkGray} name="left" size={25} />
        </TouchableOpacity>
      ),
    }
  }

  state = {
    endDate: this.props.navigation.getParam("endDate", null),
    location: this.props.navigation.getParam("location", null),
    startDate: this.props.navigation.getParam("startDate", null),
    selectedUsers: [],
    users: this.props.navigation.getParam("users", []),
  }

  _updateTrip = async ({ currentTrip }) => {
    const { endDate, location, selectedUsers, startDate, users } = this.state
    try {
      this.setState({ pending: true })
      const newUsers = selectedUsers.filter(selectedUser => !users.includes(selectedUser))
      const removedUsers = users.filter(user => !selectedUsers.includes(user))
      if (newUsers.length) {
        await Promise.all(newUsers.map(async newUser => {
          const usersInvites = await firebase
            .firestore()
            .collection("Invites")
            .doc(newUser)
            .collection("invites")
            .doc(currentTrip)
            .set({})
        }))
      }
      if (removedUsers.length) {
        await Promise.all(removedUsers.map(async removedUser => {
          await firebase
            .firestore()
            .collection("UsersTrips")
            .doc(removedUser)
            .collection("usersTrips")
            .doc(currentTrip)
            .delete()
        }))
      }

      await firebase.firestore()
        .collection("Trips")
        .doc(currentTrip)
        .update({
          endDate,
          location,
          startDate,
          users: users.filter(user => !removedUsers.includes(user))
        })
      Alert.alert("Trip Updated", "You successfully updated your trip.")
      this.props.navigation.navigate(TRIP)
    } catch (err) {
      this.setState({ pending: false })
      Alert.alert("Error", "Unable to save changes. Please try again.")
    }
  }

  _renderLocation = () => {
    const { location } = this.state
    return (
      <View style={styles.item}>
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          this.props.navigation.navigate(LOCATION, {
            selectLocation: location => this.setState({ location })
          })
        }}
      >
        <Text size="xxlarge" type={Fonts.CerealExtraBold}>
          Where
        </Text>
        {location ? (
          <Text size="large" type={Fonts.CerealBold}>
            {location}
          </Text>
        ) : (
          <Icon.Feather
            name="chevron-right"
            size={30}
          />
        )}
      </TouchableOpacity>
      </View>
    )
  }

  _renderStartAndEndDate = () => {
    const { endDate, startDate } = this.state
    return (
      <View style={styles.item}>
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          this.props.navigation.navigate(CALENDAR, {
            selectDates: ({ endDate, startDate }) => this.setState({ endDate, startDate })
          })
        }}
      >
        <Text size="xxlarge" type={Fonts.CerealExtraBold}>
          When
        </Text>
        {startDate && endDate ? (
          <Text size="large" type={Fonts.CerealBold}>
            {displayDates({ startDate, endDate })}
          </Text>
        ) : (
          <Icon.Feather
            name="chevron-right"
            size={30}
          />
        )}
      </TouchableOpacity>
      </View>
    )
  }

  _renderUsers = () => {
    const { selectedUsers, users } = this.state
    return (
      <View style={styles.item}>
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          this.props.navigation.navigate(SEARCH, {
            setUsers: selectedUsers => this.setState({ selectedUsers })
          })
        }}
      >
        <Text size="xxlarge" type={Fonts.CerealExtraBold}>
          Who
        </Text>
        <Text size="large" type={Fonts.CerealBold}>
          {`${selectedUsers.length || users.length} Travelers`}
        </Text>
      </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Subscribe to={[ProfileContainer]}>
        {(profileContainer) => {
          return (
            <Flex>
              <View style={styles.container}>
                {this._renderLocation()}
                {this._renderStartAndEndDate()}
                {this._renderUsers()}
                <Button
                  pending={this.state.pending}
                  style={styles.saveButton}
                  transparent
                  onPress={() => {
                    this._updateTrip({
                      currentTrip: profileContainer.state.profile.currentTrip
                    })
                  }}
                >
                  <Text>Save</Text>
                </Button>
              </View>
            </Flex>
          )
        }}
      </Subscribe>
    )
  }
}

export default EditTrip

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
  headerIcon: {
    paddingHorizontal: DEFAULT_PADDING / 2,
  },
  item: {
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 1,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 15,
    paddingTop: 30,
  },
  saveButton: {
    alignSelf: "center",
    borderWidth: 2,
    marginTop: 30,
    width: DEVICE_WIDTH / 2,
  },
})
