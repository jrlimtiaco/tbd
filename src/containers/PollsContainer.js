import firebase from "firebase"
import { Container } from "unstated"
import { formatCollection } from "../utils/collection"

const initialState = {
  pending: true,
  polls: []
}

export default class PollsContainer extends Container {
  constructor() {
    super()
    this.state = initialState
    this._getPolls()
  }

  _getPolls = async () => {
    try {
      const db = firebase.firestore()
      const profile = await db.collection("Users").doc(`${firebase.auth().currentUser.uid}`).get()
      const { currentTrip } = profile.data()
      if (currentTrip) {
        await db
          .collection("Polls")
          .doc(`${currentTrip}`)
          .collection("polls")
          .onSnapshot(snapshot => {
            this.setState({
              pending: false,
              polls: formatCollection(snapshot),
            })
          })
      } else {
        this.setState({ pending: false })
      }
    } catch (err) {
      console.log("## _getPolls err:", err)
    }
  }

  _refreshPolls = () => {
    this.setState({ ...initialState }, () => this._getPolls())
  }

}
