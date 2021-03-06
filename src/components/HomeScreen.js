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

import ProfileContainer from "../containers/ProfileContainer"
import TripContainer from "../containers/TripContainer"
import UsersTripsContainer from "../containers/UsersTripsContainer"
import { Subscribe } from "unstated"

import { displayDates } from "../utils/dates"

import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../constants/dimensions"
import { CHAT, CHECKLIST, DETAILS, EDIT_TRIP, ITINERARY, NAME_TRIP, POLLS, USER_LIST } from "../constants/routes"
import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"

const ICON_SIZE = DEVICE_WIDTH < 370
  ? 40
  : DEVICE_WIDTH > 400
  ? 60
  : 50

export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null,
  }

  render() {
    return (
      <Subscribe to={[ProfileContainer, TripContainer, UsersTripsContainer]}>
        {(profileContainer, tripContainer, usersTripsContainer) => {
          const { navigation: { navigate } } = this.props
          const { currentTrip } = profileContainer.state.profile
          const { usersTrips } = usersTripsContainer.state
          const { image, trip: { endDate, location, startDate, tripName, users } } = tripContainer.state
          if (!usersTrips.length || !currentTrip) {
            return <CreateFirstTrip />
          } else {
            return (
              <Flex>
                <StatusBar translucent />
                <Flex>
                  <Flex style={styles.imageContainer}>
                    {image && (
                      <>
                        <FlexImage source={{ uri: image }} style={styles.image} />
                        <View style={styles.imageBackground} />
                      </>
                    )}
                  </Flex>
                  <View style={styles.tripDetailsContainer}>
                    <Flex>
                      <TouchableOpacity onPress={() => navigate(NAME_TRIP)}>
                        <Text
                          ellipsizeMode="tail"
                          numberOfLines={1}
                          color={Colors.darkGray}
                          size="xxlarge"
                          type={Fonts.CerealBlack}
                          style={styles.name}
                        >
                          {tripName || `Try "Trip to ${location}"`}
                        </Text>
                      </TouchableOpacity>
                      <Text ellipsizeMode="tail" numberOfLines={1} style={styles.location}>
                        {location}{"  "}
                        <Text color={Colors.gray} ellipsizeMode="tail" numberOfLines={1} size="small">
                          {displayDates({ startDate, endDate })}
                        </Text>
                      </Text>
                      <TouchableOpacity onPress={() => navigate(USER_LIST)}>
                        <Text>
                          {users.length} Travelers
                        </Text>
                      </TouchableOpacity>
                    </Flex>
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
                      <Icon.Feather name="map" size={ICON_SIZE} style={styles.icon} />
                      <Text type={Fonts.CerealBook}>Itinerary</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate(CHAT)} style={styles.tripItem}>
                      <Icon.Feather name="message-square" size={ICON_SIZE} style={styles.icon} />
                      <Text type={Fonts.CerealBook}>Chat</Text>
                      <UnreadCount type={MESSAGE} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.tripItemRow}>
                    <TouchableOpacity onPress={() => navigate(DETAILS)} style={styles.tripItem}>
                      <Icon.Feather name="edit" size={ICON_SIZE} style={styles.icon} />
                      <Text type={Fonts.CerealBook}>Polls & Suggestions</Text>
                      <UnreadCount type={POLL_SUGGESTION} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate(CHECKLIST)} style={styles.tripItem}>
                      <Icon.Feather name="clipboard" size={ICON_SIZE} style={styles.icon} />
                      <Text type={Fonts.CerealBook}>Checklist</Text>
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
  image: {
    height: "100%",
    width: "auto",
  },
  imageBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(219,190,153,0.35)",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  location: {
    paddingBottom: 7,
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
    marginTop: 10,
    marginHorizontal: DEFAULT_PADDING * 1.3,
  },
  tripItem: {
    alignItems: "center",
    backgroundColor: Colors.lightGray,
    borderRadius: 3,
    flex: 1,
    justifyContent: "center",
    margin: DEFAULT_PADDING * 0.65,
  },
  tripItemContainer: {
    margin: DEFAULT_PADDING * 0.65,
  },
  tripItemRow: {
    flex: 1,
    flexDirection: "row",
  },
})
