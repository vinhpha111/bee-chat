<template>
<div>
    <div v-for="(message, index) in listMessage" class="w3-panel w3-pale-green w3-border-green w3-border" :key="index">
        <label class="w3-tag w3-light-blue">{{message.author.fullname}}</label>
        <div v-html="message.content"></div>
        <div v-for="(children, index) in message.childrens" class="w3-panel w3-pale-blue w3-leftbar w3-border-blue" :key="index">
            <label class="w3-tag w3-light-blue">{{children.author.fullname}}</label>
            <div v-html="children.content"></div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            listMessage: []
        }
    },
    created(){
        const slugRoom = this.$route.params.slug
        this.getMessageInRoom(slugRoom)
    },
    methods: {
        getMessageInRoom(slug) {
            this.$store.dispatch('getMessageInRoom', slug).then((res) => {
                this.listMessage = res.data
            })
        }
    },
}
</script>