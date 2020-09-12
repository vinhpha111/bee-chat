<template>
  <div :class="[message.author._id === $store.getters.getUserInfo._id ? 'w3-pale-blue': 'w3-light-gray']" 
      class="w3-panel w3-border-light-blue w3-border w3-margin-left w3-margin-right msg-item w3-display-container">
      <label class="w3-text-blue user-link"><b>{{message.author.fullname}}</b></label>
      <label :title="getDateTimeByFormat(message.created_at, '%y/%m/%d %h:%i')" 
          class="w3-margin-left w3-text-blue-grey w3-tiny">
          <i>{{getDateTimeByFormat(message.created_at, '%h:%i')}}</i>
      </label>
      <div v-html="message.content"></div>
      <div v-if="message.childrens.length > 0" class="list-msg-child">
          <div v-for="(children, index) in message.childrens" class="w3-panel w3-pale-blue w3-leftbar w3-border-blue msg-item-child" :key="index">
              <label class="w3-text-blue user-link"><b>{{children.author.fullname}}</b></label>
              <label :title="getDateTimeByFormat(message.created_at, '%y/%m/%d %h:%i')"
                  class="w3-margin-left w3-text-blue-grey w3-tiny">
                  <i>{{getDateTimeByFormat(children.created_at, '%h:%i')}}</i>
              </label>
              <div v-html="children.content"></div>
          </div>
      </div>
  </div>
</template>
<script>
export default {
  name: "MessageRow",
  props: ['message'],
  computed: {
      getDateTimeByFormat() {
          return (milisecond,format) => {
              try {
                  const dateTime = new Date(milisecond)
                  const weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                  const dataReplace = {
                      l : weekDay[dateTime.getDay()],
                      d : dateTime.getDate(),
                      m : dateTime.getMonth() + 1,
                      y : dateTime.getFullYear(),
                      h : dateTime.getHours(),
                      i : dateTime.getMinutes(),
                      s : dateTime.getSeconds(),
                  }
                  let timeString = format || '%y/%m/%d %h:%i'
                  for (let key in dataReplace) {
                      const value = dataReplace[key]
                      timeString = timeString.replace('%'+key, value)
                  }
                  return timeString

              } catch(err){
                  console.log(err)
              }
              return ''
          }
      }
  },
}
</script>