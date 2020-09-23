<template>
    <div class="footer-chat-box">
        <VueTrix class="trix-input" v-model="editorContent" placeholder="Typing message" @trix-focus="trixFocus" @trix-blur="trixBlur" localStorage/>
        <button @click="sendMessage" class="send-btn w3-btn w3-green">send</button>
    </div>
</template>
<script>
import VueTrix from "vue-trix"
import $ from "jquery"
export default {
    props: ['type'],
    components: {
        VueTrix
    },
    data() {
        return {
            editorContent: ''
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
            switch (this.type) {
                case 'room': {
                    const room = this.$store.getters.getListRoom.find(room => room.slug === this.$route.params.slug )
                    let data = {
                        content: this.editorContent,
                        roomId: room._id,
                        parent: null
                    }
                    this.$store.dispatch('sendMessageInRoom', data).then(() => {
                        this.editorContent = ''
                    })
                    break;
                }
                default:
                    break;
            }
        }
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
    }
}
</style>