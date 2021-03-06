import React, { Component } from "react"
import firebase from "firebase"

import ChatContainer from "./containers/ChatContainer"
import InvitesContainer from "./containers/InvitesContainer"
import ItineraryContainer from "./containers/ItineraryContainer"
import PollsContainer from "./containers/PollsContainer"
import ProfileContainer from "./containers/ProfileContainer"
import SuggestionsContainer from "./containers/SuggestionsContainer"
import TripContainer from "./containers/TripContainer"
import UsersTripsContainer from "./containers/UsersTripsContainer"
import UsersContainer from "./containers/UsersContainer"

import { Provider, Subscribe } from "unstated"

const CONTAINERS = [
  ChatContainer,
  InvitesContainer,
  ItineraryContainer,
  PollsContainer,
  ProfileContainer,
  SuggestionsContainer,
  TripContainer,
  UsersTripsContainer,
  UsersContainer,
]

class AppContainers extends Component {
  state = {
    containers: [],
    pending: true,
  }

  componentDidMount() {
    this.setState({
      containers: CONTAINERS.map(Container => new Container()),
      pending: false,
    })
  }

  render() {
    const { containers, pending } = this.state
    return (
      <Provider inject={containers}>
        <Subscribe to={pending ? [] : CONTAINERS}>
          {(...subscribedContainers) =>
            this.props.children({
              pending: pending || subscribedContainers.some(container => container.state.pending),
            })
          }
        </Subscribe>
      </Provider>
    )
  }
}

export default AppContainers
