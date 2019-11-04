import firebase from "firebase"
import { Container } from "unstated"
import { formatCollection } from "../utils/collection"

const initialState = {
  pending: true,
  invites: []
}

export default class InvitesContainer extends Container {
  constructor() {
    super()
    this.state = initialState
    this._getInvites()
  }

  _getInvites = () => {
    try {
      firebase
        .firestore()
        .collection("Invites")
        .doc(firebase.auth().currentUser.uid)
        .collection("invites")
        .onSnapshot(snapshot => {
          const invites = formatCollection(snapshot)
          this.setState({
            pending: false,
            invites: invites.map(invite => invite.id),
          })
        })
    } catch (err) {
      console.log("## _getInvites err:", err)
    }
  }

  _refreshInvites = () => {
    this.setState({ ...initialState }, () => this._getInvites())
  }

}
