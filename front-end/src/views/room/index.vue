<template>
<div>
    <HeaderChatBox :room="room" />
    <ListMessage type="room"/>
    <FooterChatBox type="room" />
</div>
</template>

<script>
import ListMessage from '../../components/ListMessage'
import HeaderChatBox from '../../components/HeaderChatBox'
import FooterChatBox from '../../components/FooterChatBox'
export default {
    components: {
        ListMessage,
        HeaderChatBox,
        FooterChatBox
    },
    data() {
        return {
            room: null
        }
    },
    created() {
        this.room = this.$store.getters.getListRoom.find(room => room.slug === this.$route.params.slug )
    },
}
</script>