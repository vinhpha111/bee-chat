<template>
  <div :class="['list-msg-box', {'no-scroll': type === 'reply'}, classUnique]">
    <div class="list-msg">
      <LoadingMessageSpin v-if="loadingMessageUp" />
      <MessageRow v-for="(message, index) in listMessage" :message="message" :key="index"
        :is-thread="type === 'reply'" />
    </div>
  </div>
</template>
<script>
  import MessageRow from './MessageRow'
  import LoadingMessageSpin from './LoadingMessageSpin'
  import { SERVER } from '../helper/constant'
  import {
    notifySound
  } from '../helper/sound'
  export default {
    props: ['type', 'messages', 'parent'],
    components: {
      MessageRow,
      LoadingMessageSpin
    },
    data() {
      return {
        classUnique: (new Date()).getTime().toString(),
        listMessage: [],
        slugRoom: '',
        room: {},
        loadingMessageUp: false
      }
    },
    async created() {
      this.room = await this.$store.dispatch('getRoomBySlug', this.$route.params.slug).then(res => res.data)
      this.slugRoom = this.$route.params.slug
      this.listMessage = await this.getMessages()
      this.scrollTobottom()
      this.addScrollListener()
      this.listenMessage()
    },
    methods: {
      async getMessages() {
        switch (this.type) {
          case 'room': {
            const exceptIds = this.getExceptMessageId()
            const dataQuery = {
              slugRoom: this.slugRoom,
              query: {
                exceptIds
              }
            }
            this.loadingMessageUp = true
            return await this.$store.dispatch('getMessageInRoom', dataQuery).then((res) => {
              let data = res.data
              data.reverse()
              this.loadingMessageUp = false
              return data
            }).catch(() => {
              this.loadingMessageUp = false
              return []
            })
          }
          case 'reply': {
            return this.messages
          }
        }
        return []
      },
      listenMessage() {
        switch (this.type) {
          case 'room': {
            const room = this.room
            this.$store.dispatch('onSocket', {
              on: room._id,
              callback: (data) => {
                if(data.type === SERVER.TYPE_EMIT_TO_ROOM.NEW_MESSAGE) {
                  const user = this.$store.getters.getUserInfo
                  if (user._id !== data.message.author._id) {
                    notifySound()
                  }
                  if (!data.message.parent) {
                    this.listMessage.push(data.message)
                  } else {
                    this.addChildrenToMessage(data.message)
                  }
                  this.keepPositionInScroll()
                }
              }
            })
            break
          }
          case 'reply': {
            const room = this.room
            this.$store.dispatch('onSocket', {
              on: room._id,
              callback: (data) => {
                if(data.type === SERVER.TYPE_EMIT_TO_ROOM.NEW_MESSAGE) {
                  const user = this.$store.getters.getUserInfo
                  if (this.parent._id !== data.message.parent) {
                    return false
                  }
                  if (user._id !== data.message.author._id) {
                    notifySound()
                  }
                  this.listMessage.push(data.message)
                }
              }
            })
            break
          }

          default:
            break;
        }
      },
      addChildrenToMessage(children) {
        for (let i = 0; i < this.listMessage.length; i++) {
          if (children.parent === this.listMessage[i]._id) {
            this.listMessage[i].childrens.push(children)
          }
        }
      },
      scrollTobottom() {
        setTimeout(() => {
          const scrollBar = document.getElementsByClassName('list-msg-box')[0]
          const listMessageBar = document.getElementsByClassName('list-msg')[0]
          scrollBar.scrollTo(0, listMessageBar.offsetHeight)
        }, 100);
      },
      keepPositionInScroll() {
        const oldMessageBarHeight = document.getElementsByClassName('list-msg')[0].offsetHeight
        setTimeout(() => {
          const scrollBar = document.getElementsByClassName('list-msg-box')[0]
          const newMessageBarHeight = document.getElementsByClassName('list-msg')[0].offsetHeight
          scrollBar.scrollTo(0, scrollBar.scrollTop + newMessageBarHeight - oldMessageBarHeight)
        });
      },
      getExceptMessageId() {
        let ids = []
        this.listMessage.forEach((item) => {
          ids.push(item._id)
        })
        return ids
      },
      loadMore() {
        this.listMessage.push(this.listMessage[this.listMessage.length - 1])
        this.keepPositionInScroll()
      },
      async loadPrevious() {
        this.listMessage = (await this.getMessages()).concat(this.listMessage)
        this.keepPositionInScroll()
      },
      addScrollListener() {
        const scrollBar = document.getElementsByClassName(this.classUnique)[0]
        scrollBar.onscroll = () => {
          if (scrollBar.scrollTop === 0) {
            this.loadPrevious()
          }
        }
      }
    },
  }
</script>
<style lang="sass">
  @import '../css/chat-list.module';
</style>
