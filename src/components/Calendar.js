import React, { Component } from "react"
import { Modal, StyleSheet } from "react-native"

import Button from "./common/Button"
import Flex from "./common/Flex"
import Text from "./common/Text"

import moment from "moment"
import { Calendar } from "react-native-calendars"
import { range } from "lodash"

import { Colors, Fonts } from "../constants/style"
import { DEVICE_WIDTH } from "../constants/dimensions"

class CalendarScreen extends Component {
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
    const { onClose, selectDates } = this.props
    const { endDate, startDate } = this.state

    if (startDate && endDate) {
      selectDates({ endDate, startDate })
    }
    this.setState({
      startDate: null,
      endDate: null,
      markedDates: {},
    })
    onClose()
  }

  render() {
    const { markedDates } = this.state
    const { onClose, visible } = this.props
    return (
      <Modal
        animationType={"fade"}
        onRequestClose={onClose}
        supportedOrientations={["portrait"]}
        transparent={false}
        visible={visible}
      >
        <Flex>
          <Flex style={styles.container}>
            <Text
              color={Colors.darkGray}
              size="xxxxxlarge"
              style={styles.heading}
              type={Fonts.CerealExtraBold}
            >
              Select Dates
            </Text>
            <Calendar
              markedDates={markedDates}
              markingType="period"
              onDayPress={this._onDayPress}
            />
          </Flex>
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
      </Modal>
    )
  }
}

export default CalendarScreen

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
  },
  confirmButton: {
    borderWidth: 2,
  },
  heading: {
    paddingBottom: 30,
    paddingTop: 20,
  },
})
