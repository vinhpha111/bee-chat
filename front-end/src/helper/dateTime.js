module.exports = {
  getDateTimeByFormat: (milisecond, format) => {
    try {
      const dateTime = new Date(milisecond)
      const weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      const dataReplace = {
        l: weekDay[dateTime.getDay()],
        d: dateTime.getDate(),
        m: dateTime.getMonth() + 1,
        y: dateTime.getFullYear(),
        h: dateTime.getHours(),
        i: dateTime.getMinutes(),
        s: dateTime.getSeconds(),
      }
      let timeString = format || '%y/%m/%d %h:%i'
      for (let key in dataReplace) {
        const value = dataReplace[key]
        timeString = timeString.replace('%' + key, value)
      }
      return timeString

    } catch (err) {
      console.log(err)
    }
    return ''
  },
}