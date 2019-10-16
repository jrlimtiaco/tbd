import React, { Component } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'

import * as Icon from "@expo/vector-icons"
import Button from "./common/Button"
import Flex from "./common/Flex"
import CreateFirstTrip from "./CreateFirstTrip"
import Polls from "./Polls"
import Text from "./common/Text"

import ProfileContainer from "../containers/ProfileContainer"
import TripContainer from "../containers/TripContainer"
import { Subscribe } from "unstated"

import { displayDates } from "../utils/dates"

import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../constants/dimensions"
import { CHAT, CHECKLIST, DETAILS, EDIT_TRIP, ITINERARY, NAME_TRIP, POLLS } from "../constants/routes"
import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"

export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null,
  }

  render() {
    return (
      <Subscribe to={[ProfileContainer, TripContainer]}>
        {(profileContainer, tripContainer) => {
          const { navigation: { navigate } } = this.props
          const { trips } = profileContainer.state.profile
          const { trip: { endDate, location, startDate, tripName } } = tripContainer.state
          if (!trips.length) {
            return <CreateFirstTrip />
          } else {
            return (
              <Flex>
                <Flex>
                  <View style={{ flex: 1 }} />
                  <View style={styles.tripDetailsContainer}>
                    <TouchableOpacity
                      onPress={() => navigate(NAME_TRIP)}
                      style={styles.tripNameText}
                    >
                      <Text color={Colors.darkGray} size="xxxlarge" type={Fonts.CerealBlack}>
                        {tripName || `Try "Trip to ${location}"`}
                      </Text>
                    </TouchableOpacity>
                    <Text size="large" type={Fonts.CerealBold}>
                      {location}{"  "}
                      <Text color={Colors.gray}>
                        {displayDates({ startDate, endDate })}
                      </Text>
                    </Text>
                    <View style={styles.editAndTravelersContainer}>
                      <Text size="small" type={Fonts.CerealBlack}>
                        1 Travelers
                      </Text>
                      <TouchableOpacity
                        onPress={() => navigate(EDIT_TRIP, { endDate, location, startDate })}
                        style={styles.editButton}
                      >
                        <Text size="small" type={Fonts.CerealBold}>
                          Edit
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Flex>
                <Flex style={styles.tripItemContainer}>
                  <View style={styles.tripItemRow}>
                    <TouchableOpacity onPress={() => navigate(ITINERARY)} style={styles.tripItem}>
                      <Icon.Feather name="map" size={50} style={styles.icon} />
                      <Text>Itinerary</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate(CHAT)} style={styles.tripItem}>
                      <Icon.Feather name="message-square" size={50} style={styles.icon} />
                      <Text>Chat</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.tripItemRow}>
                    <TouchableOpacity onPress={() => navigate(CHECKLIST)} style={styles.tripItem}>
                      <Icon.Feather name="clipboard" size={50} style={styles.icon} />
                      <Text>Checklist</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate(DETAILS)} style={styles.tripItem}>
                      <Icon.Feather name="edit" size={50} style={styles.icon} />
                      <Text>Polls & Suggestions</Text>
                    </TouchableOpacity>
                  </View>
                </Flex>
              </Flex>
            )
          }
        }}
      </Subscribe>
    )
  }
}

const styles = StyleSheet.create({
  editAndTravelersContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 5,
  },
  editButton: {
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 2,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  icon: {
    marginBottom: 10,
  },
  tripDetailsContainer: {
    marginHorizontal: 15,
  },
  tripItem: {
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 3,
    flex: 1,
    justifyContent: "center",
    margin: DEFAULT_PADDING * 0.25,
  },
  tripItemContainer: {
    margin: DEFAULT_PADDING * 0.25,
  },
  tripItemRow: {
    flex: 1,
    flexDirection: "row",
  },
  tripNameText: {
    paddingBottom: 5,
  },
})
