<template>
  <div :class="['footer-chat-box', classUnique]">
    <InputEditor :roomId="roomId" :being-edit="editMessage" :ref="`input-editor-${classUnique}`" @updateHeight="updateHeight" v-model="editorContent" />
    <button @click="sendMessage" class="send-btn">
      <i v-if="!sending" class="fa fa-send-o"></i><i v-if="sending" class="fa fa-circle-o-notch fa-spin"></i>
    </button>
  </div>
</template>
<script>
  import InputEditor from '../components/TextInputChat'
  import $ from 'jquery'
  import eventBus from '../helper/eventBus'
  export default {
    props: ['type', 'message', 'roomId'],
    components: {
      InputEditor
    },
    data() {
      return {
        editorContent: '',
        sending: false,
        classUnique: (new Date()).getTime().toString(),
        room: null,
        editMessage: null
      }
    },
    watch: {
      editorContent: function (val) {
        if ((val || '').trim().length === 0) {
          this.editMessage = null
        }
      }
    },
    async created() {
      if (['Room', 'Contact'].indexOf(this.$route.name) !== -1) {
        this.room = await this.$store.dispatch('getRoomBySlug', this.$route.params.slug).then(res => res.data)
      }
      eventBus.$on('setEditMessage', this.setEditMessage)
    },
    methods: {
      sendMessage() {
        if (this.sending || this.editorContent.trim().length === 0) {
          return false
        }
        this.sending = true
        if (this.editMessage) {
          this.submitEditMessage()
          return
        }
        switch (this.type) {
          case 'room': {
            const content = this.editorContent
            const room = this.room
            let data = {
              content: content,
              roomId: room._id,
              parent: null
            }
            this.$store.dispatch('sendMessageInRoom', data).then(() => {
              this.editorContent = ''
              this.sending = false
              this.$refs[`input-editor-${this.classUnique}`].setHtml(this.editorContent)
            }).catch(() => {
              this.sending = false
            })
            break;
          }
          case 'reply': {
            const content = this.editorContent
            let data = {
              content: content,
              roomId: this.message.in_room,
              parent: this.message._id
            }
            this.$store.dispatch('sendMessageInRoom', data).then(() => {
              this.editorContent = ''
              this.sending = false
              this.$refs[`input-editor-${this.classUnique}`].setHtml(this.editorContent)
            }).catch(() => {
              this.sending = false
            })
            break
          }
          default:
            break;
        }
      },
      updateHeight(height) {
        $(`.${this.classUnique}`).closest('.main-thread').find('.list-msg-box').css('height', `calc(100vh - ${height + 40}px)`)
      },
      setEditMessage(data) {
        if (data.type === this.type) {
          this.editMessage = data.message
          this.$refs[`input-editor-${this.classUnique}`].setHtml(data.message.content)
        }
      },
      submitEditMessage() {
        const content = this.editorContent
        let data = {
          content: content,
          id: this.editMessage._id,
        }
        this.$store.dispatch('sendEditMessage', data).then(() => {
          this.editorContent = ''
          this.sending = false
          this.$refs[`input-editor-${this.classUnique}`].setHtml(this.editorContent)
        }).catch(() => {
          this.sending = false
        })
      }
    },
    destroyed() {
      eventBus.$off('setEditMessage', this.setEditMessage)
    }
  }
</script>
<style lang="scss">
.footer-chat-box {
  display: flex;
  width: 100%;
  position: relative;

  .text-input {
    width: calc(100% - 80px);
  }

  .send-btn {
    position: absolute;
    width: 80px;
    height: 100%;
    right: 0;
    top: 0;
    background-color: gold;
    outline: none;
    border: none;
    cursor: pointer;
  }
}
</style>