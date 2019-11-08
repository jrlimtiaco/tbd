import React from "react"
import { Subscribe } from "unstated"

import MenuBadge from "./common/MenuBadge"
import TabBadge from "./common/TabBadge"

import InvitesContainer from "../containers/InvitesContainer"

export const InviteCountMenu = () => {
  return (
    <Subscribe to={[InvitesContainer]}>
      {(invitesContainer) => (
        <MenuBadge count={invitesContainer.state.invites.length} />
      )}
    </Subscribe>
  )
}

export const InviteCountTab = () => {
  return (
    <Subscribe to={[InvitesContainer]}>
      {(invitesContainer) => (
        <TabBadge count={invitesContainer.state.invites.length} />
      )}
    </Subscribe>
  )
}
