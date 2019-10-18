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
import { CALENDAR, LOCATION, TRIP } from "../constants/routes"
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
  }

  _updateTrip = async ({ currentTrip }) => {
    const { navigation } = this.props
    const { endDate, location, startDate } = this.state
    try {
      this.setState({ pending: true })
      await firebase.firestore()
        .collection("Trips")
        .doc(currentTrip)
        .update({ endDate, location, startDate })
      Alert.alert("Trip Updated", "You successfully updated your trip.")
      navigation.navigate(TRIP)
    } catch (err) {
      this.setState({ pending: false })
      Alert.alert("Error", "Unable to save changes. Please try again.")
    }
  }

  _renderLocation = () => {
    const { location } = this.state
    return (
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
    )
  }

  _renderStartAndEndDate = () => {
    const { endDate, startDate } = this.state
    return (
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
    )
  }

  render() {
    return (
      <Subscribe to={[ProfileContainer]}>
        {(profileContainer) => {
          const { _refreshProfile: refreshProfile } = profileContainer
          const { currentTrip, trips } = profileContainer.state.profile
          return (
            <Flex>
              <View style={styles.container}>
                {this._renderLocation()}
                <View style={styles.separator} />
                {this._renderStartAndEndDate()}
                <View style={styles.separator} />
                <TouchableOpacity style={styles.row}>
                  <Text size="xxlarge" type={Fonts.CerealExtraBold}>
                    Who
                  </Text>
                  <Icon.Feather name="chevron-right" size={30} />
                </TouchableOpacity>
                <View style={styles.separator} />
                <Button
                  pending={this.state.pending}
                  style={styles.saveButton}
                  transparent
                  onPress={() => this._updateTrip({ currentTrip })}
                >
                  <Text>
                    Save
                  </Text>
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
  separator: {
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 1,
  },
})
