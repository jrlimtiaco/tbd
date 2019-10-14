import firebase from "firebase"
import { Container } from "unstated"
import { formatCollection } from "../utils/collection"

const initialState = {
  pending: true,
  itinerary: [],
}

export default class ItineraryContainer extends Container {
  constructor() {
    super()
    this.state = initialState
    this._getItinerary()
  }

  _getItinerary = async () => {
    try {
      const db = firebase.firestore()
      const profile = await db.collection("Users").doc(`${firebase.auth().currentUser.uid}`).get()
      const { currentTrip } = profile.data()
      if (currentTrip) {
        const suggestions = await db
          .collection("Itineraries")
          .doc(`${currentTrip}`)
          .collection("itineraries")
          .onSnapshot(snapshot => {
            this.setState({
              pending: false,
              itinerary: formatCollection(snapshot),
            })
          })
      } else {
        this.setState({ pending: false })
      }
    } catch (err) {
      console.log("## _getItinerary err:", err)
    }
  }

  _refreshItinerary = () => {
    this.setState({ ...initialState }, () => this._getItinerary())
  }

}
