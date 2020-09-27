<template>
    <div class="footer-chat-box">
        <VueTrix ref="vue-trix" :class="['trix-input', sending ? 'disable-trix' : '']" v-model="editorContent" placeholder="Typing message" @trix-focus="trixFocus" v-click-outside="trixBlur" localStorage/>
        <button @click="sendMessage" class="send-btn w3-btn w3-green">
            {{!sending ? 'send' : ''}}<i v-if="sending" class="fa fa-circle-o-notch fa-spin"></i>
        </button>
    </div>
</template>
<script>
import VueTrix from "vue-trix"
import ClickOutside from 'vue-click-outside'
import $ from "jquery"
import linkifyHtml from 'linkifyjs/html'
export default {
    props: ['type'],
    components: {
        VueTrix
    },
    data() {
        return {
            editorContent: '',
            sending: false
        }
    },
    methods: {
        trixFocus() {
            $('trix-toolbar').show()
        },
        trixBlur() {
            $('trix-toolbar').hide()
        },
        sendMessage() {
            if (this.sending || this.editorContent.length === 0) {
                return false
            }
            this.sending = true
            switch (this.type) {
                case 'room': {
                    const content = this.filterContent(this.editorContent)
                    const room = this.$store.getters.getListRoom.find(room => room.slug === this.$route.params.slug )
                    let data = {
                        content: content,
                        roomId: room._id,
                        parent: null
                    }
                    this.$store.dispatch('sendMessageInRoom', data).then(() => {
                        this.editorContent = ''
                        this.sending = false
                    }).catch(() => {
                        this.sending = false
                    })
                    break;
                }
                default:
                    break;
            }
        },
        filterContent(content) {
            content = linkifyHtml(content, {
                defaultProtocol: 'https'
            })
            let html = $('<div>'+content+'html')
            // add target blank
            html.find('a').attr("target","_blank")

            html = html.html()
            return html
        }
    },
    directives: {
        ClickOutside
    }
}
</script>
<style lang="scss">
.footer-chat-box {
    height: 80px;
    display: flex;
    .send-btn {
        width: 80px;
        height: 80px;
        &:focus { outline: none; }
    }
    .trix-input {
        width: calc(100% - 80px);
        position: relative;
        trix-toolbar {
            position: absolute;
            top: -36px;
            display: none;
            background-color: #ffffff;
            .trix-button--icon-attach {
                display: none;
            }
        }
        trix-editor {
            height: 80px;
            overflow-y: auto;
        }
        &.disable-trix {
            trix-editor {
                pointer-events: none !important;
                background-color: #cccccc !important;
            }
        }
    }
}
</style>