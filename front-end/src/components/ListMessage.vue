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
    async created(){
        this.slugRoom = this.$route.params.slug
        this.listMessage = await this.getMessages()
        this.scrollTobottom()
        this.addScrollListener()
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
                    })
                }
            }
            return []
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
}
</script>
<style lang="sass">
@import '../css/chat-list.module';
</style>