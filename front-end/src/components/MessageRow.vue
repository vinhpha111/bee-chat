<template>
    <div :class="[message.author._id === $store.getters.getUserInfo._id ? 'w3-pale-blue': 'w3-light-gray', 'text-input-editor-view', 'message-row']" 
        class="w3-panel w3-border-light-blue w3-border msg-item w3-display-container">
        <label class="w3-text-blue user-link"><b>{{message.author.fullname}}</b></label>
        <label :title="getDateTimeByFormat(message.created_at, '%y/%m/%d %h:%i')" 
            class="w3-margin-left w3-text-blue-grey w3-tiny">
            <i>{{getDateTimeByFormat(message.created_at, '%h:%i')}}</i>
        </label>
        <div v-html="message.content"></div>
        <div class="msg-item-footer">
            <span class="reply" @click="$store.commit('subThread/setType', 'comment')" :title="getListUserInChild(message.childrens)"><i class="fa fa-share-square-o"></i> reply <i v-if="message.childrens.length > 0">({{message.childrens.length}})</i></span>
            <span class="add-emoji" :title="$t('message_item.add_emoji')" @click="$refs['emoji-box'].show()"><i class="fa fa-smile-o"></i></span>
        </div>
        <EmojiBox ref="emoji-box"/>
    </div>
</template>
<script>
import EmojiBox from './EmojiBox/EmojiBox'
export default {
    name: "MessageRow",
    props: ['message', 'is-thread'],
    components: {
        EmojiBox
    },
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
        },
        getListUserInChild() {
            return (childs) => {
                if (childs.length > 0) {
                    let nameArray = childs.map((child) => child.author.fullname )
                    let uniqueNameArray = []
                    for (const index in nameArray) {
                        if (uniqueNameArray.indexOf(nameArray[index]) === -1) {
                            uniqueNameArray.push(nameArray[index])
                        }
                    }
                    return uniqueNameArray.join(', ')
                }
                return this.$t('message_item.reply')
            }
        }
    },
}
</script>