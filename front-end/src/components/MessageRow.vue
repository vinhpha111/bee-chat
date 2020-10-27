<template>
    <div v-if="message" :class="[messageOwner ? 'w3-border-blue w3-leftbar': 'w3-border','text-input-editor-view message-row w3-panel w3-border msg-item w3-display-container']">
        <label :class="[messageOwner ? 'w3-text-blue': 'w3-text-light-blue', 'w3-text-blue user-link']"><b>{{message.author.fullname}}</b></label>
        <label :title="getDateTimeByFormat(message.created_at, '%y/%m/%d %h:%i')" 
            class="w3-margin-left w3-text-blue-grey w3-tiny">
            <i>{{getDateTimeByFormat(message.created_at, '%h:%i')}}</i>
        </label>
        <div v-html="message.content"></div>
        <div class="msg-item-footer">
            <span v-if="!isThread" class="reply" @click="replyMessage(message)" :title="getListUserInChild(message.childrens)"><i class="fa fa-share-square-o"></i> reply <i v-if="message.childrens.length > 0">({{message.childrens.length}})</i></span>
            <span v-for="(emoji, index) in listEmoji" :key="index" :title="getListUserName(emoji.members)" @click="addEmoji(emoji.emoji)" class="emoji">{{emoji.emoji.char}} {{emoji.count}}</span>
            <span class="add-emoji" :title="$t('message_item.add_emoji')" @click="showEmoji"><i class="fa fa-smile-o"></i></span>
        </div>
        <EmojiBox @selectEmoji="addEmoji" ref="emoji-box"/>
    </div>
</template>
<script>
import EmojiBox from './EmojiBox/EmojiBox'
import { orderBy } from 'lodash'
import { SERVER } from '../helper/constant'
export default {
    name: "MessageRow",
    props: ['message', 'is-thread'],
    components: {
        EmojiBox
    },
    async created() {
        await this.$store.dispatch('emitSocketCallback', {on: 'join', room: this.message._id,token: this.$store.getters.getToken})
        await this.$store.dispatch('removeListenSocket', this.message._id)
        await this.listenSocker() 
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
        },
        messageOwner() {
            return this.message.author._id === this.$store.getters.getUserInfo._id
        },
        listEmoji() {
            let listEmoji = []
            let emojis = orderBy(this.message.emojis, ['emoji'], ['asc'])
            for (let i = 0; i < emojis.length; i++) {
                if (i === 0 || emojis[i].emoji !== emojis[i - 1].emoji) {
                    listEmoji.push({
                        emoji: JSON.parse(emojis[i].emoji),
                        type: emojis[i].type,
                        count: 1,
                        members: [emojis[i].author]
                    })
                } else {
                    const pos = listEmoji.length - 1
                    listEmoji[pos].count = listEmoji[pos].count + 1
                    if (listEmoji[pos].members.map(m => m._id).indexOf(emojis[i].author._id) === -1) {
                        listEmoji[pos].members.push(emojis[i].author)
                    }
                }
            }
            return listEmoji
        }
    },
    methods: {
        replyMessage(message) {
            this.$store.commit('subThread/setType', 'reply')
            this.$store.commit('setMessageReply', message)
        },
        showEmoji(event) {
            this.$refs['emoji-box'].show(event.clientX, event.clientY)
        },
        addEmoji(emoji) {
            const emojiIdHasAdd = this.checkHasAddEmoji(emoji)
            if (emojiIdHasAdd) {
                this.$store.dispatch('removeEmoji', { id: emojiIdHasAdd })
            } else {
                const data = {
                    emoji,
                    message_id: this.message._id
                }
                this.$store.dispatch('addEmojiChar', data)
            }
        },
        checkHasAddEmoji(emoji) {
            const currentUser = this.$store.getters.getUserInfo
            for (let i = 0; i < this.message.emojis.length; i++) {
                const currentEmoji = JSON.parse(this.message.emojis[i].emoji)
                if (this.message.emojis[i].author._id === currentUser._id && currentEmoji.char === emoji.char) {
                    return this.message.emojis[i]._id
                }
            }
            return null
        },
        getListUserName(members) {
            return members.map(m => m.fullname).join(', ')
        },
        listenSocker() {
            this.$store.dispatch('onSocket', {
                on: this.message._id,
                callback: (data) => {
                    switch (data.type) {
                        case SERVER.TYPE_EMIT_TO_MESSAGE.ADD_EMOJI:
                            this.onSocketAddEmoji(data)
                            break;
                        case SERVER.TYPE_EMIT_TO_MESSAGE.REMOVE_EMOJI:
                            this.onSocketRemoveEmoji(data)
                            break
                        default:
                            break;
                    }
                }
            })
        },
        onSocketAddEmoji(data) {
            const { result: { emoji } } = data
            this.message.emojis.push(emoji)
        },
        onSocketRemoveEmoji(data) {
            const { result: { emoji } } = data
            this.message.emojis = this.message.emojis.filter(currentEmoji => {
                return currentEmoji._id !== emoji._id
            })
        }
    },
}
</script>