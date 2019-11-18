import firebase from "firebase"
import { Container } from "unstated"
import { formatCollection } from "../utils/collection"

const initialState = {
  pending: true,
  suggestions: []
}

export default class SuggestionsContainer extends Container {
  constructor() {
    super()
    this.state = initialState
    this._getSuggestions()
  }

  _getSuggestions = async () => {
    try {
      const db = firebase.firestore()
      const { currentTrip } = (await db
        .collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .get())
        .data()
      if (currentTrip) {
        db.collection("Suggestions")
          .doc(currentTrip)
          .collection("suggestions")
          .onSnapshot(snapshot => {
            this.setState({
              pending: false,
              suggestions: formatCollection(snapshot),
            })
          })
      } else {
        this.setState({ pending: false })
      }
    } catch (err) {
      console.log("## _getSuggestions err:", err)
    }
  }

  _refreshSuggestions = () => {
    this.setState({ ...initialState }, () => this._getSuggestions())
  }

}
