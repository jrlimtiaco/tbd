import firebase from "firebase"
import { Container } from "unstated"
import config from "../config"

const options = {
  headers: {
    'Authorization': config.apiKey
  }
}

const initialState = {
  pending: true,
  image: null,
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
      const { currentTrip } = (await db
        .collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .get())
        .data()
      if (currentTrip) {
        await db
          .collection("Trips")
          .doc(currentTrip)
          .onSnapshot(async snapshot => {
            const trip = snapshot.data()
            if (!trip.users.includes(firebase.auth().currentUser.uid)) {
              await db
                .collection("Users")
                .doc(firebase.auth().currentUser.uid)
                .update({
                  currentTrip: null
                })
              firebase.auth().signOut()
            }
            if (trip.location !== this.state.trip.location) {
              const res = await fetch(
                `https://api.pexels.com/v1/search?query=${trip.location}&per_page=15&page=1`,
                options
              )
              const { photos } = await res.json()
              const image = photos && photos[0]
              this.setState({
                trip,
                pending: false,
                image: image && image.src && image.src.landscape,
              })
            } else {
              this.setState({ pending: false, trip })
            }
          })
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
