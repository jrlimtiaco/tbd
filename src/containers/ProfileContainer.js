import firebase from "firebase"
import { Container } from "unstated"

const initialState = {
  lastRead: {
    message: null,
    suggestion: null,
  },
  pending: true,
  profile: {},
}

export default class ProfileContainer extends Container {
  constructor() {
    super()
    this.state = initialState
    this._getProfile()
  }

  _getProfile = async () => {
    try {
      const db = firebase.firestore()
      const profile = (await db
        .collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .get())
        .data()
      if (profile.currentTrip) {
        db.collection("Users")
          .doc(firebase.auth().currentUser.uid)
          .collection("LastRead")
          .doc(profile.currentTrip)
          .onSnapshot(snapshot => {
            this.setState({
              lastRead: snapshot.data() || initialState.lastRead,
              pending: false,
              profile,
            })
          })
      } else {
        this.setState({ pending: false, profile })
      }
    } catch (err) {
      console.log("## _getProfile err:", err)
    }
  }

  _refreshProfile = () => {
    this.setState({ ...initialState }, () => this._getProfile())
  }

}
