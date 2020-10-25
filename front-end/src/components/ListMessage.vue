<template>
<div class="list-msg-box">
    <div class="list-msg">
        <LoadingMessageSpin v-if="loadingMessageUp" />
        <MessageRow v-for="(message, index) in listMessage" :message="message" :key="index" />
    </div>
</div>
</template>
<script>
import MessageRow from './MessageRow'
import LoadingMessageSpin from './LoadingMessageSpin'
import { notifySound } from '../helper/sound'
export default {
    props: ['type'],
    components: {
        MessageRow,
        LoadingMessageSpin
    },
    data() {
        return {
            listMessage: [],
            slugRoom: '',
            loadingMessageUp: false
        }
    },
    async created() {
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
            }
            return []
        },
        listenMessage() {
            const room = this.$store.getters.getListRoom.find(room => room.slug === this.slugRoom )
            this.$store.dispatch('onSocket', {
                on: room._id,
                callback: (data) => {
                    const user = this.$store.getters.getUserInfo
                    if (user._id !== data.message.author._id) {
                        notifySound()
                    }
                    this.listMessage.push(data.message)
                    this.keepPositionInScroll()
                }
            })
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
            const scrollBar = document.getElementsByClassName('list-msg-box')[0]
            scrollBar.onscroll = () => {
                if (scrollBar.scrollTop === 0) {
                    this.loadPrevious()
                }
            }
        }
    },
    destroyed() {
        const room = this.$store.getters.getListRoom.find(room => room.slug === this.slugRoom)
        this.$store.dispatch('removeListenSocket', room._id)
    },
}
</script>
<style lang="sass">
@import '../css/chat-list.module';
</style>