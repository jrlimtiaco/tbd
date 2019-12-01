import firebase from "firebase"

export const removeUser = async (userId, tripId) => {
  try {
    const db = firebase.firestore()
    await db
      .collection("UsersTrips")
      .doc(userId)
      .collection("usersTrips")
      .doc(tripId)
      .delete()
    const { users } = (await db
      .collection("Trips")
      .doc(tripId)
      .get())
      .data()
    await db
      .collection("Trips")
      .doc(tripId)
      .update({
        users: users.filter(user => user !== userId)
      })
  } catch (err) {
    console.log("## removeUser:", err)
  }
}
