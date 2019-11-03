import firebase from "firebase"
import { Container } from "unstated"
import { formatCollection } from "../utils/collection"

const initialState = {
  pending: true,
  usersTrips: [],
}

export default class UsersTripsContainer extends Container {
  constructor() {
    super()
    this.state = initialState
    this._getUsersTrips()
  }

  _getUsersTrips = async () => {
    try {
      await firebase
        .firestore()
        .collection("UsersTrips")
        .doc(`${firebase.auth().currentUser.uid}`)
        .collection("usersTrips")
        .onSnapshot(snapshot => {
          const usersTrips = formatCollection(snapshot)
          this.setState({
            pending: false,
            usersTrips: usersTrips.map(usersTrip => usersTrip.id),
          })
        })
    } catch (err) {
      console.log("## _getUsersTrips err:", err)
    }
  }

  _refreshUsersTrips = () => {
    this.setState({ ...initialState }, () => this._getUsersTrips())
  }

}
