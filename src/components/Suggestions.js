import React, { Component } from "react"
import { FlatList } from "react-native"
import { Subscribe } from "unstated"

import EmptyListText from "./common/EmptyListText"
import Flex from "./common/Flex"
import SuggestionItem from "./SuggestionItem"

import SuggestionsContainer from "../containers/SuggestionsContainer"

class Suggestions extends Component {

  _renderItem = ({ item }) => {
    return (
      <SuggestionItem suggestion={item} />
    )
  }

  render() {
    return (
      <Subscribe to={[SuggestionsContainer]}>
        {(suggestionsContainer) => {
          this._suggestions = suggestionsContainer.state.suggestions
          return (
            <Flex>
              <FlatList
                data={this._suggestions}
                keyExtractor={item => item.id}
                renderItem={this._renderItem}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={(
                  <EmptyListText>
                    Create suggestions for your trip
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

export default Suggestions
