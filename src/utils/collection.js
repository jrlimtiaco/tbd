export const formatCollection = (snapshot, order = "desc") => {
  let collection = []
  snapshot.forEach(item => collection.push({ ...item.data(), id: item.id }))
  return collection.sort((a, b) => {
    if (a.createdAt < b.createdAt) {
      return order === "desc" ? 1 : -1
    } else if (a.createdAt > b.createdAt) {
      return order === "desc" ? -1 : 1
    } else {
      return 0
    }
  })
}
