import firebase from "firebase"
import { Container } from "unstated"

const initialState = {
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
      const profile = await firebase
        .firestore()
        .collection("Users")
        .doc(`${firebase.auth().currentUser.uid}`)
        .get()
      this.setState({ pending: false, profile: profile.data() })
    } catch (err) {
      console.log("## _getProfile err:", err)
    }
  }

  _refreshProfile = () => {
    this.setState({ ...initialState }, () => this._getProfile())
  }

}
