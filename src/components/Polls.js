import React, { Component } from "react"
import { FlatList } from "react-native"
import { Subscribe } from "unstated"

import EmptyListCard from "./common/EmptyListCard"
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
                  <EmptyListCard
                    title="No Polls"
                    description="Make your trip better with polls"
                  />
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
