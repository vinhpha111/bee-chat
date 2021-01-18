<template>
  <div v-if="message" :class="['text-input-editor-view message-row msg-item', classUnique, { 'has-notify': message.notify }]">
    <div class="avatar-col">
      <a href="#" @click="showModalUserEvent($event, message.author)"><img class="avatar"
          :src="message.author.avatar_path || getAvatarByName(message.author.fullname)"></a>
    </div>
    <div class="main-col">
      <div class="header">
        <label
          @click="showModalUserEvent($event, message.author)"
          :class="[messageOwner ? 'w3-text-blue': 'w3-text-light-blue', 'w3-text-blue user-link']"
        >
          <b>{{message.author.fullname}}</b>
        </label>
        <label
          :title="createdAt"
          class="w3-margin-left w3-text-blue-grey w3-tiny"
        >
          <i>{{ createdAt }}</i>
        </label>
        <label class="more-option">
          <i @click="showMoreOption()" class="fa fa-ellipsis-v more-option__icon"></i>
          <OptionMessageDropdown
            :is-owner="message.author._id === $store.getters.getUserInfo._id"
            :ref="`msg-option`"
            @edit="setEditMessage()"
          />
        </label>
        <label class="edited-label" v-if="message.created_at !== message.updated_at">{{ $t('message_item.edited') }}</label>
      </div>
      <div class="content" v-html="message.content"></div>
      <div class="msg-item-footer">
        <span
          v-if="!isThread" class="reply" @click="replyMessage(message)"
          :title="getListUserInChild(message.childrens)"
        >
          <i class="fa fa-share-square-o"></i> reply <i v-if="message.childrens.length > 0">({{message.childrens.length}})</i>
        </span>
        <span v-for="(emoji, index) in listEmoji" :key="index" :title="getListUserName(emoji.members)"
          @click="addEmoji(emoji.emoji)" class="emoji">{{emoji.emoji.char}} {{emoji.count}}</span>
        <span class="add-emoji" :title="$t('message_item.add_emoji')" @click="showEmoji"><i
            class="fa fa-smile-o"></i></span>
      </div>
    </div>
    <EmojiBox @selectEmoji="addEmoji" ref="emoji-box" />
    <UserInfoModal v-if="showModalUser" @close="showModalUser = false" :user-data="modalUserData" />
  </div>
</template>
<script>
  import EmojiBox from './EmojiBox/EmojiBox'
  import { orderBy } from 'lodash'
  import { SERVER } from '../helper/constant'
  import generateAvatarUrlFromName from '../helper/generateAvatarUrlFromName'
  import { getDateTimeByFormat } from '../helper/dateTime';
  import UserInfoModal from './UserInfoModal'
  import OptionMessageDropdown from './OptionMessageDropdown'
  import eventBus from '../helper/eventBus'
  import $ from "jquery"
  export default {
    name: "MessageRow",
    props: ['message', 'is-thread'],
    data() {
      return {
        classUnique: (new Date()).getTime().toString(),
        showModalUser: false,
        modalUserData: null
      }
    },
    components: {
      EmojiBox,
      UserInfoModal,
      OptionMessageDropdown
    },
    async created() {
      await this.$store.dispatch('emitSocketCallback', {
        on: 'join',
        room: this.message._id,
        token: this.$store.getters.getToken
      })
      await this.listenSocker()

      this.setHasViewInterval()
    },
    watch: {
      async message() {
        await this.$store.dispatch('emitSocketCallback', {
          on: 'join',
          room: this.message._id,
          token: this.$store.getters.getToken
        })
        await this.listenSocker()
      }
    },
    computed: {
      createdAt() {
        const today = (new Date()).getTime()
        if (getDateTimeByFormat(today, '%y/%m/%d') === getDateTimeByFormat(this.message.created_at, '%y/%m/%d')) {
          return getDateTimeByFormat(this.message.created_at, '%h:%i')
        }
        return getDateTimeByFormat(this.message.created_at, '%y/%m/%d %h:%i')
      },
      getListUserInChild() {
        return (childs) => {
          if (childs.length > 0) {
            let nameArray = childs.map((child) => child.author.fullname)
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
      },
      getAvatarByName() {
        return name => generateAvatarUrlFromName(name)
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
          this.$store.dispatch('removeEmoji', {
            id: emojiIdHasAdd
          })
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
              case SERVER.TYPE_EMIT_TO_MESSAGE.EDIT_MESSAGE:
                this.onSocketUpdateMessage(data)
                break
              default:
                break;
            }
          }
        })
      },
      onSocketAddEmoji(data) {
        const {
          result: {
            emoji
          }
        } = data
        this.message.emojis.push(emoji)
      },
      onSocketRemoveEmoji(data) {
        const {
          result: {
            emoji
          }
        } = data
        this.message.emojis = this.message.emojis.filter(currentEmoji => {
          return currentEmoji._id !== emoji._id
        })
      },
      onSocketUpdateMessage(data) {
        const {
          result: {
            message
          }
        } = data
        this.message.content = message.content
        this.message.updated_at = message.updated_at
      },
      showModalUserEvent(event, userData) {
        this.modalUserData = userData
        this.$set(this.modalUserData, 'posX', event.clientX)
        this.$set(this.modalUserData, 'posY', event.clientY)
        this.showModalUser = true
      },
      showMoreOption() {
        this.$refs[`msg-option`].show()
      },
      setEditMessage() {
        const data = {
          type: this.isThread ? 'reply' : 'room',
          message: this.message
        }
        eventBus.$emit('setEditMessage', data)
      },
      setHasViewInterval() {
        const self = this
        if (self.message.notify === true || self.message.parent) {
          let overLoopCheckView = setInterval(() => {
            const topPos = $(`.${self.classUnique}`).position().top
            if (topPos > 0 && topPos < $('body').height()) {
              self.$store.dispatch('deleteMessageNotify', self.message._id)
              clearInterval(overLoopCheckView)
            }
          }, 500)
        }
      }
    },
  }
</script>