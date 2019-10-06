import React, { Component } from "react"
import firebase from "firebase"

import PollsContainer from "./containers/PollsContainer"
import ProfileContainer from "./containers/ProfileContainer"
import SuggestionsContainer from "./containers/SuggestionsContainer"
import TripContainer from "./containers/TripContainer"

import { Provider, Subscribe } from "unstated"

const CONTAINERS = [
  PollsContainer,
  ProfileContainer,
  SuggestionsContainer,
  TripContainer,
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
