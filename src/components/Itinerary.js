import React, { Component } from "react"
import { Alert, FlatList, LayoutAnimation, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { Subscribe } from "unstated"
import { connectActionSheet } from '@expo/react-native-action-sheet'
import { groupBy } from "lodash"
import * as Icon from "@expo/vector-icons"
import firebase from "firebase"
import moment from "moment"

import Flex from "./common/Flex"
import EmptyListCard from "./common/EmptyListCard"
import Headline from "./common/Headline"
import Text from "./common/Text"

import ItineraryContainer from "../containers/ItineraryContainer"
import TripContainer from "../containers/TripContainer"

import { ADD_ITINERARY_ITEM } from "../constants/routes"
import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"

import { displayDates, getTripDates } from "../utils/dates"

const ITEM_SIZE = 80

@connectActionSheet
class Itinerary extends Component {
  static navigationOptions = ({ navigation }) => {
    const addEvent = navigation.getParam("addEvent")
    return {
      headerTitle: "Itinerary",
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Icon.AntDesign color={Colors.darkGray} name="left" size={25} />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity onPress={() => addEvent && addEvent()} style={styles.headerIcon}>
          <Icon.AntDesign color={Colors.darkGray} name="plus" size={25} />
        </TouchableOpacity>
      ),
    }
  }

  state = {
    index: 0,
  }

  _selectedDate = null

  componentDidMount() {
    this.props.navigation.setParams({ addEvent: this._addEvent })
  }

  _addEvent = () => {
    this.props.navigation.navigate(ADD_ITINERARY_ITEM, { selectedDate: this._selectedDate })
  }

  _deleteEvent = async (eventId) => {
    try {
      const db = firebase.firestore()
      const profile = await db.collection("Users").doc(`${firebase.auth().currentUser.uid}`).get()
      const { currentTrip } = profile.data()
      await db
        .collection("Itineraries")
        .doc(`${currentTrip}`)
        .collection("itineraries")
        .doc(eventId)
        .delete()
    } catch (err) {
      console.log("## err:", err)
    }
  }

  _renderEvent = ({ item, index }) => {
    return (
      <TouchableWithoutFeedback
        onLongPress={() => {
          this.props.showActionSheetWithOptions({
            options: ['Delete', 'Cancel'],
            cancelButtonIndex: 1,
            destructiveButtonIndex: 0,
          },
            buttonIndex => buttonIndex === 0 && this._deleteEvent(item.id)
          )
        }}
      >
        <View style={styles.eventItemContainer}>
          <Text color={Colors.gray} style={styles.eventTime} type={Fonts.CerealExtraBold}>
            {item.startTime}
          </Text>
          <View style={styles.eventItem}>
            <View style={styles.dot} />
            <View style={styles.eventItemTextContainer}>
              <Text>{item.event}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  _renderDates = ({ item, index: i }) => {
    const isSelected = this.state.index === i
    return (
      <TouchableOpacity
        key={item}
        style={[styles.item, isSelected && styles.selected]}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
          this.setState({ index: i })
          this._dates.scrollToItem({ item })
        }}
      >
        <Text
          align="center"
          color={isSelected ? Colors.darkGray : Colors.gray}
          type={Fonts.CerealExtraBold}
        >
          {moment(item).format("ddd")}{"\n"}
          <Text
            align="center"
            color={isSelected ? Colors.darkGray : Colors.gray}
            size="xlarge"
            type={Fonts.CerealExtraBold}
          >
            {moment(item).format("DD")}
          </Text>
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Subscribe to={[ItineraryContainer, TripContainer]}>
        {(itineraryContainer, tripContainer) => {
          const { itinerary } = itineraryContainer.state
          const { endDate, startDate } = tripContainer.state.trip
          const dates = getTripDates({ startDate, endDate })
          const events = groupBy(itinerary, item => item.date)
          this._selectedDate = dates[this.state.index]
          const selectedDayEvents = (events[this._selectedDate] || []).sort(
            (a, b) => moment(a.startTime, "hh:mm a").valueOf() - moment(b.startTime, "hh:mm a").valueOf()
          )
          return (
            <Flex>
              <View style={styles.container}>
                <Text size="xlarge" color={Colors.darkGray} style={styles.dates} type={Fonts.CerealBold}>
                  {displayDates({ startDate, endDate })}
                </Text>
                <View
                  style={[
                    styles.dateScrollerContainer,
                    !!selectedDayEvents.length && styles.border,
                  ]}
                >
                  <FlatList
                    ref={ref => (this._dates = ref)}
                    horizontal
                    data={dates}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this._renderDates}
                    showsHorizontalScrollIndicator={false}
                    getItemLayout={(data, index) => (
                      { length: ITEM_SIZE + 8, offset: (ITEM_SIZE + 8) * index, index }
                    )}
                  />
                </View>
                <Flex>
                  <FlatList
                    data={selectedDayEvents}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this._renderEvent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={(
                      <EmptyListCard
                        title="No Plans"
                        description={`Make some plans for ${moment(this._selectedDate).format("MMMM Do YYYY")}`}
                      />
                    )}
                  />
                  {!!selectedDayEvents.length && (
                    <View style={styles.line} />
                  )}
                </Flex>
              </View>
            </Flex>
          )
        }}
      </Subscribe>
    )
  }
}

export default Itinerary

const styles = StyleSheet.create({
  border: {
    borderBottomWidth: 1,
    borderColor: Colors.gray,
    paddingBottom: DEFAULT_PADDING * 1.25,
  },
  container: {
    flex: 1,
    paddingHorizontal: DEFAULT_PADDING,
  },
  dates: {
    paddingVertical: DEFAULT_PADDING,
  },
  dateScrollerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    backgroundColor: Colors.darkGray,
    borderRadius: 5,
    height: 10,
    marginLeft: -5,
    width: 10,
  },
  eventItem: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    marginLeft: 5,
    paddingVertical: 20,
  },
  eventItemContainer: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },
  eventItemTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  eventTime: {
    marginLeft: 10,
    minWidth: 80,
  },
  headerIcon: {
    paddingHorizontal: DEFAULT_PADDING / 2,
  },
  item: {
    alignItems: "center",
    borderColor: Colors.gray,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    marginLeft: 8,
    padding: 15,
    height: ITEM_SIZE,
    width: ITEM_SIZE,
  },
  line: {
    backgroundColor: Colors.gray,
    bottom: 0,
    left: 94.5,
    position: "absolute",
    top: 0,
    width: 1,
    zIndex: -10,
  },
  selected: {
    borderColor: Colors.darkGray,
    borderWidth: 1.5,
  },
})
