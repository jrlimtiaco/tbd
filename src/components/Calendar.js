import React, { Component } from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import { Calendar } from "react-native-calendars"
import { range } from "lodash"
import moment from "moment"

import * as Icon from "@expo/vector-icons"
import Button from "./common/Button"
import Flex from "./common/Flex"
import Headline from "./common/Headline"
import Text from "./common/Text"

import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"
import { DEVICE_WIDTH } from "../constants/dimensions"

class CalendarScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Icon.AntDesign color={Colors.darkGray} name="left" size={25} />
        </TouchableOpacity>
      ),
    }
  }

  state = {
    endDate: null,
    markedDates: {},
    startDate: null,
  }

  _onDayPress = day => {
    const { endDate, startDate } = this.state

    if (!startDate || day.dateString < startDate || (startDate && endDate)) {
      const startDate = day.dateString
      const markedDates = {
        [startDate]: { color: "#C75454", endingDay: true, startingDay: true, textColor: Colors.lightGray },
      }
      this.setState({
        endDate: null,
        markedDates,
        startDate,
      })
    } else {
      const endDate = day.dateString
      const daysInBetween = moment(endDate).diff(startDate, "day")
      const daysInBetweenMarked = range(daysInBetween).reduce((acc, cur) => {
        const nextDay = moment(startDate).add(cur, "day").format("YYYY-MM-DD")
        acc[nextDay] = { color: "#C75454", selected: true, textColor: Colors.lightGray }
        return acc
      }, {})
      const markedDates = {
        ...daysInBetweenMarked,
        [startDate]: { color: "#C75454", startingDay: true, textColor: Colors.lightGray },
        [endDate]: { color: "#C75454", endingDay: true, textColor: Colors.lightGray },
      }
      this.setState({ endDate, markedDates })
    }
  }

  _onPress = () => {
    const { navigation } = this.props
    const { endDate, startDate } = this.state
    const selectDates = navigation.getParam("selectDates")
    if (startDate && endDate && selectDates) {
      selectDates({ endDate, startDate })
    }
    navigation.goBack()
  }

  render() {
    const { markedDates } = this.state
    return (
      <Flex>
        <Flex style={styles.container}>
          <Headline>Select Dates</Headline>
          <Calendar
            markedDates={markedDates}
            markingType="period"
            onDayPress={this._onDayPress}
            theme={{ arrowColor: Colors.darkGray }}
          />
          <Button
            onPress={this._onPress}
            style={styles.confirmButton}
            transparent
          >
            <Text size="medium">
              Confirm
            </Text>
          </Button>
        </Flex>
      </Flex>
    )
  }
}

export default CalendarScreen

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
  },
  confirmButton: {
    alignSelf: "center",
    borderWidth: 2,
    marginTop: 30,
    width: DEVICE_WIDTH / 2,
  },
  headerIcon: {
    paddingHorizontal: DEFAULT_PADDING / 2,
  },
})
