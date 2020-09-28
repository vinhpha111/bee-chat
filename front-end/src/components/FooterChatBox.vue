<template>
    <div class="footer-chat-box">
        <InputEditor @updateHeight="updateHeight" ref="input-editor" v-model="editorContent"/>
        <button @click="sendMessage" class="send-btn w3-btn w3-green">
            {{!sending ? 'send' : ''}}<i v-if="sending" class="fa fa-circle-o-notch fa-spin"></i>
        </button>
    </div>
</template>
<script>
import InputEditor from '../components/TextInputChat'
import $ from 'jquery'
export default {
    props: ['type'],
    components: {
        InputEditor
    },
    data() {
        return {
            editorContent: '',
            sending: false
        }
    },
    methods: {
        sendMessage() {
            if (this.sending || this.editorContent.length === 0) {
                return false
            }
            this.sending = true
            switch (this.type) {
                case 'room': {
                    const content = this.editorContent
                    const room = this.$store.getters.getListRoom.find(room => room.slug === this.$route.params.slug )
                    let data = {
                        content: content,
                        roomId: room._id,
                        parent: null
                    }
                    this.$store.dispatch('sendMessageInRoom', data).then(() => {
                        this.editorContent = ''
                        this.sending = false
                        this.$refs['input-editor'].setHtml(this.editorContent)
                    }).catch(() => {
                        this.sending = false
                    })
                    break;
                }
                default:
                    break;
            }
        },
        updateHeight(height) {
            $('.list-msg-box').css('height', `calc(100vh - ${height + 40}px)`)
            $('.footer-chat-box .send-btn').css('height', `${height}px`)
        }
    }
}
</script>
<style lang="scss">
.footer-chat-box {
    display: flex;
    .send-btn {
        width: 80px;
        height: 80px;
        &:focus { outline: none; }
    }
}
</style>