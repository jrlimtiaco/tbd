import firebase from "firebase"
import { Container } from "unstated"
import { formatCollection } from "../utils/collection"

const initialState = {
  pending: true,
  chat: [],
}

export default class ChatContainer extends Container {
  constructor() {
    super()
    this.state = initialState
    this._getChat()
  }

  _getChat = async () => {
    try {
      const db = firebase.firestore()
      const profile = await db.collection("Users").doc(`${firebase.auth().currentUser.uid}`).get()
      const { currentTrip } = profile.data()
      if (currentTrip) {
        const suggestions = await db
          .collection("Chats")
          .doc(`${currentTrip}`)
          .collection("chats")
          .onSnapshot(snapshot => {
            this.setState({
              pending: false,
              chat: formatCollection(snapshot),
            })
          })
      } else {
        this.setState({ pending: false })
      }
    } catch (err) {
      console.log("## _getChat err:", err)
    }
  }

  _refreshChat = () => {
    this.setState({ ...initialState }, () => this._getChat())
  }

}
