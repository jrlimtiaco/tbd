import moment from "moment"

export const displayDates = ({ startDate, endDate }) => {
  const start = moment(startDate)
  const end = moment(endDate)
  const isSameMonth = start.get("month") === end.get("month")
  if (isSameMonth) {
    return `${start.format("MMM DD")} - ${end.format("DD, YYYY")}`
  } else {
    const isSameYear = start.get("year") === end.get("year")
    if (isSameYear) {
      return `${start.format("MMM DD")} - ${end.format("MMM DD, YYYY")}`
    } else {
      return `${start.format("MMM DD, YYYY")} - ${end.format("MMM DD, YYYY")}`
    }
  }
}

export const getTripDates = ({ startDate, endDate }) => {
  let date = startDate
  let dates = []
  while (date <= endDate) {
    dates.push(date)
    date = moment(date, "YYYY-MM-DD").add(1, 'day').format("YYYY-MM-DD")
  }
  return dates
}
