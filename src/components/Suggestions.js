import React, { Component } from "react"
import { FlatList } from "react-native"
import { Subscribe } from "unstated"
import firebase from "firebase"

import EmptyListCard from "./common/EmptyListCard"
import Flex from "./common/Flex"
import SuggestionItem from "./SuggestionItem"

import ProfileContainer from "../containers/ProfileContainer"
import SuggestionsContainer from "../containers/SuggestionsContainer"

class Suggestions extends Component {

  _renderItem = ({ item }) => {
    return (
      <SuggestionItem suggestion={item} />
    )
  }

  _setLastReadSuggestion = (suggestionId, currentTripId) => {
    firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .collection("LastRead")
      .doc(currentTripId)
      .set({ suggestion: suggestionId }, { merge: true })
  }

  render() {
    return (
      <Subscribe to={[ProfileContainer, SuggestionsContainer]}>
        {(profileContainer, suggestionsContainer) => {
          const { suggestions } = suggestionsContainer.state
          const { lastRead, profile } = profileContainer.state
          if (suggestions.length) {
            const lastSuggestion = suggestions[0]
            if (lastSuggestion.id !== lastRead.suggestion) {
              this._setLastReadSuggestion(lastSuggestion.id, profile.currentTrip)
            }
          }
          return (
            <Flex>
              <FlatList
                data={suggestionsContainer.state.suggestions}
                keyExtractor={item => item.id}
                renderItem={this._renderItem}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={(
                  <EmptyListCard
                    title="No Suggestions"
                    description="Make the trip better with suggestions"
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

export default Suggestions
