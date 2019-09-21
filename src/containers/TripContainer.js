import firebase from "firebase"
import { Container } from "unstated"

const initialState = {
  pending: true,
  trip: {},
}

export default class TripContainer extends Container {
  constructor() {
    super()
    this.state = initialState
    this._getTrip()
  }

  _getTrip = async () => {
    try {
      const db = firebase.firestore()
      const profile = await db.collection("Users").doc(`${firebase.auth().currentUser.uid}`).get()
      const { currentTrip } = profile.data()
      if (currentTrip) {
        const trip = await db
          .collection("Trips")
          .doc(`${currentTrip}`)
          .onSnapshot(snapshot => this.setState({
            pending: false,
            trip: snapshot.data(),
          }))
      } else {
        this.setState({ pending: false })
      }
    } catch (err) {
      console.log("## _getTrip err:", err)
    }
  }

  _refreshTrips = () => {
    this.setState({ ...initialState }, () => this._getTrip())
  }

}
