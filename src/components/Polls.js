import React, { Component } from "react"
import { FlatList } from "react-native"
import { Subscribe } from "unstated"

import EmptyListText from "./common/EmptyListText"
import Flex from "./common/Flex"
import PollItem from "./PollItem"

import PollsContainer from "../containers/PollsContainer"

class Polls extends Component {

  _renderItem = ({ item }) => {
    return (
      <PollItem poll={item} />
    )
  }

  render() {
    return (
      <Subscribe to={[PollsContainer]}>
        {(pollsContainer) => {
          return (
            <Flex>
              <FlatList
                data={pollsContainer.state.polls}
                keyExtractor={item => item.id}
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
