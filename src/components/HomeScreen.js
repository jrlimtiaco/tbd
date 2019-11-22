import React, { Component } from 'react'
import { ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native'

import * as Icon from "@expo/vector-icons"
import Button from "./common/Button"
import Flex from "./common/Flex"
import FlexImage from "./common/FlexImage"
import CreateFirstTrip from "./CreateFirstTrip"
import Polls from "./Polls"
import Text from "./common/Text"
import UnreadCount, { MESSAGE, POLL_SUGGESTION } from "./UnreadCount"

import TripContainer from "../containers/TripContainer"
import UsersTripsContainer from "../containers/UsersTripsContainer"
import { Subscribe } from "unstated"

import { displayDates } from "../utils/dates"

import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../constants/dimensions"
import { CHAT, CHECKLIST, DETAILS, EDIT_TRIP, ITINERARY, NAME_TRIP, POLLS, USER_LIST } from "../constants/routes"
import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"

export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null,
  }

  render() {
    return (
      <Subscribe to={[TripContainer, UsersTripsContainer]}>
        {(tripContainer, usersTripsContainer) => {
          const { navigation: { navigate } } = this.props
          const { usersTrips } = usersTripsContainer.state
          const { image, trip: { endDate, location, startDate, tripName, users } } = tripContainer.state
          if (!usersTrips.length) {
            return <CreateFirstTrip />
          } else {
            return (
              <Flex>
                <StatusBar translucent />
                <Flex>
                  <View style={{ flex: 1 }}>
                    {image && (
                      <FlexImage
                        source={{ uri: image }}
                        style={{ width: "100%" }}
                      />
                    )}
                  </View>
                  <View style={styles.tripDetailsContainer}>
                    <View style={{ flex: 1 }}>
                      <TouchableOpacity onPress={() => navigate(NAME_TRIP)}>
                        <Text color={Colors.darkGray} size="xxxlarge" type={Fonts.CerealBlack} style={styles.name}>
                          {tripName || `Try "Trip to ${location}"`}
                        </Text>
                      </TouchableOpacity>
                      <Text size="large" type={Fonts.CerealBold} style={styles.location}>
                        {location}{"  "}
                        <Text color={Colors.gray}>
                          {displayDates({ startDate, endDate })}
                        </Text>
                      </Text>
                      <TouchableOpacity onPress={() => navigate(USER_LIST)}>
                        <Text size="small" type={Fonts.CerealBlack}>
                          {users.length} Travelers
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      onPress={() => navigate(EDIT_TRIP, { endDate, location, startDate, users })}
                      style={styles.editButton}
                    >
                      <Text size="small" type={Fonts.CerealBold}>
                        Edit
                      </Text>
                    </TouchableOpacity>
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
                      <UnreadCount type={MESSAGE} />
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
                      <UnreadCount type={POLL_SUGGESTION} />
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
  editButton: {
    alignSelf: "flex-end",
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
  location: {
    paddingBottom: 10,
    paddingRight: 5,
  },
  name: {
    paddingBottom: 5,
    paddingRight: 5,
  },
  tripDetailsContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
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
})
