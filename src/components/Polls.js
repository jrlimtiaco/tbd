import React, { Component } from "react"
import { FlatList, StyleSheet, View } from "react-native"
import { Subscribe } from "unstated"

import AddButton from "./common/AddButton"
import Flex from "./common/Flex"
import EmptyListText from "./common/EmptyListText"
import Headline from "./common/Headline"
import PollItem from "./PollItem"
import Text from "./common/Text"
import TripContainer from "../containers/TripContainer"

import { DEVICE_HEIGHT } from "../constants/dimensions"
import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"

class Polls extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  })

  _renderItem = ({ item, index }) => {
    const poll = this._polls[item]
    return (
      <PollItem
        key={index}
        poll={poll}
        polls={this._polls}
      />
    )
  }

  render() {
    return (
      <Subscribe to={[TripContainer]}>
        {(tripContainer) => {
          this._polls = tripContainer.state.trip.polls
          const polls = Object.keys(this._polls)
          return (
            <Flex>
              <FlatList
                data={polls}
                keyExtractor={item => item}
                renderItem={this._renderItem}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={(
                  <EmptyListText>
                    Create polls for your trip
                  </EmptyListText>
                )}
              />
            </Flex>
          )
        }}
      </Subscribe>
    )
  }
}

export default Polls

const styles = StyleSheet.create({
  line: {
    borderColor: Colors.lightGray,
    borderLeftWidth: StyleSheet.hairlineWidth,
  },
  tabContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightGray,
    flexDirection: "row",
  },
  tab: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingVertical: 10,
  },
  text: {
    paddingVertical: DEFAULT_PADDING,
  },
})
