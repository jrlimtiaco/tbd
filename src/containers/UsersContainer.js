import firebase from "firebase"
import { Container } from "unstated"

const initialState = {
  pending: true,
  users: {},
}

export default class UsersContainer extends Container {
  constructor() {
    super()
    this.state = initialState
    this._getUsers()
  }

  _getUsers = async () => {
    try {
      const db = firebase.firestore()
      const { currentTrip } = (await db
        .collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .get())
        .data()
      if (currentTrip) {
        const trip = await db
          .collection("Trips")
          .doc(currentTrip)
          .onSnapshot(async snapshot => {
            const { users } = snapshot.data()
            const userList = await Promise.all(users.map(async user => {
              const userDetails = await firebase
                .firestore()
                .collection("Users")
                .doc(user)
                .get()
              return { ...userDetails.data(), id: userDetails.id }
            }))
            const userDictionary = userList.reduce((acc, cur) => {
              acc[cur.id] = cur
              return acc
            }, {})
            this.setState({
              pending: false,
              users: userDictionary
            })
          })
      } else {
        this.setState({ pending: false })
      }
    } catch (err) {
      console.log("## _getUsers err:", err)
    }
  }

  _refreshUsers = () => {
    this.setState({ ...initialState }, () => this._getUsers())
  }

}
