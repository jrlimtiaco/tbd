import React from "react"
import { Subscribe } from "unstated"
import firebase from "firebase"

import MenuBadge from "./common/MenuBadge"
import TabBadge from "./common/TabBadge"

import ChatContainer from "../containers/ChatContainer"
import InvitesContainer from "../containers/InvitesContainer"
import PollsContainer from "../containers/PollsContainer"
import ProfileContainer from "../containers/ProfileContainer"
import SuggestionsContainer from "../containers/SuggestionsContainer"

export const MESSAGE = "MESSAGE"
export const POLL = "POLL"
export const POLL_SUGGESTION = "POLL_SUGGESTION"
export const SUGGESTION = "SUGGESTION"
export const TAB = "TAB"

const getUnreadPollCount = (polls) => {
  return polls
    .map(poll => poll.options.some(option => option.votes.includes(firebase.auth().currentUser.uid)))
    .filter(isVoted => !isVoted).length
}

const getUnreadCollectionCount = (collection, lastUnreadId) => {
  let count = collection.length
  if (lastUnreadId) {
    const index = collection.findIndex(item => item.id === lastUnreadId)
    count = collection.slice(0, index).length
  }
  return count
}

export default ({ type }) => {
  return (
    <Subscribe to={[ChatContainer, PollsContainer, ProfileContainer, SuggestionsContainer]}>
      {(chatContainer, pollsContainer, profileContainer, suggestionsContainer) => {
        const numberOfUnvotedPolls = getUnreadPollCount(pollsContainer.state.polls)
        const messageCount = getUnreadCollectionCount(chatContainer.state.chat, profileContainer.state.lastRead.message)
        const suggestionCount = getUnreadCollectionCount(suggestionsContainer.state.suggestions, profileContainer.state.lastRead.suggestion)
        if (type === TAB) {
          return (
            <TabBadge count={messageCount + numberOfUnvotedPolls + suggestionCount} />
          )
        } else {
          let count
          switch (type) {
            case MESSAGE:
              count = messageCount
              break
            case POLL:
              count = numberOfUnvotedPolls
              break
            case POLL_SUGGESTION:
              count = numberOfUnvotedPolls + suggestionCount
              break
            default:
              count = suggestionCount
          }
          return (
            <MenuBadge count={count} />
          )
        }
      }}
    </Subscribe>
  )
}
