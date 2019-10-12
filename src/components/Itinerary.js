import React, { Component } from "react"
import { Alert, FlatList, LayoutAnimation, StyleSheet, TouchableOpacity, View } from "react-native"
import { Subscribe } from "unstated"
import firebase from "firebase"
import moment from "moment"

import * as Icon from "@expo/vector-icons"
import Flex from "./common/Flex"
import EmptyListText from "./common/EmptyListText"
import Headline from "./common/Headline"
import Text from "./common/Text"
import TripContainer from "../containers/TripContainer"

import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../constants/dimensions"
import { ADD_ITINERARY_ITEM } from "../constants/routes"
import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"

import { displayDates, getTripDates } from "../utils/dates"

const ITEM_SIZE = 80

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

  _deleteEvent = async (eventTime) => {
    let updatedDay = { ...this._itinerary[this._selectedDate] }
    delete updatedDay[eventTime]
    const itinerary = {
      ...this._itinerary,
      [this._selectedDate]: updatedDay,
    }
    try {
      const db = firebase.firestore()
      const profile = await db.collection("Users").doc(`${firebase.auth().currentUser.uid}`).get()
      const { currentTrip } = profile.data()
      await db
        .collection("Trips")
        .doc(`${currentTrip}`)
        .update({ itinerary })
    } catch (err) {
      console.log("## err:", err)
    }
  }

  _renderEvent = ({ item, index }) => {
    const event = this._itinerary[this._selectedDate][item]
    return (
      <View key={index} style={styles.eventItemContainer}>
        <Text color={Colors.gray} style={styles.eventTime} type={Fonts.CerealExtraBold}>
          {item}
        </Text>
        <View style={styles.eventItem}>
          <View style={styles.dot} />
          <View style={styles.eventItemTextContainer}>
            <Text>{event}</Text>
          </View>
          <TouchableOpacity onPress={() => this._deleteEvent(item)}>
            <Icon.MaterialCommunityIcons name="delete-outline" size={25} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _renderDates = ({ item, index: i }) => {
    const { index } = this.state
    return (
      <TouchableOpacity
        key={item}
        style={[styles.item, i === index && styles.selected]}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
          this.setState({ index: i })
        }}
      >
        <Text
          align="center"
          color={i === index ? Colors.darkGray : Colors.gray}
          type={Fonts.CerealExtraBold}
        >
          {moment(item).format("ddd")}{"\n"}
          <Text
            align="center"
            color={i === index ? Colors.darkGray : Colors.gray}
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
      <Subscribe to={[TripContainer]}>
        {(tripContainer) => {
          const { index } = this.state
          const { endDate, itinerary, startDate } = tripContainer.state.trip
          const dates = getTripDates({ startDate, endDate })
          this._itinerary = itinerary
          this._selectedDate = dates[index]
          const selectedDayEvents = Object.keys(this._itinerary[this._selectedDate]).sort(
            (a, b) => moment(a, "hh:mm a").valueOf() - moment(b, "hh:mm a").valueOf()
          )
          return (
            <Flex>
              <View style={styles.container}>
                <Text size="xlarge" color={Colors.darkGray} style={styles.dates} type={Fonts.CerealBold}>
                  {displayDates({ startDate, endDate })}
                </Text>
                <View style={styles.dateScrollerContainer}>
                  <FlatList
                    horizontal
                    data={dates}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this._renderDates}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
                <Flex>
                  <FlatList
                    data={selectedDayEvents}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this._renderEvent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={(
                      <EmptyListText>
                        No events for this date
                      </EmptyListText>
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
    marginBottom: DEFAULT_PADDING,
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
    left: 95,
    position: "absolute",
    top: 0,
    width: StyleSheet.hairlineWidth,
    zIndex: -10,
  },
  selected: {
    borderColor: Colors.darkGray,
    borderWidth: 1.5,
  },
})
