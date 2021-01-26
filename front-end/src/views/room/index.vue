<template>
  <div v-if="room">
    <HeaderChatBox :room="room" :type="type" :contact="contact" />
    <ListMessage type="room" />
    <FooterChatBox :roomId="room._id" type="room"  />
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
        room: null,
        type: "room-chat",
        contact: null
      }
    },
    async created() {
      const self = this
      this.room = await this.$store.dispatch('getRoomBySlug', this.$route.params.slug).then(async res => {
        await self.$store.dispatch('emitSocketCallback', {
          on: 'join',
          room: res.data._id,
          token: self.$store.getters.getToken
        })
        return res.data
      })
      if (this.$route.name === 'Contact') {
        this.contact = await this.$store.dispatch(
          'getContactBySlug', this.$route.params.slug
        ).then(res => res.data)
        
        this.type = 'contact'
      }
    },
  }
</script>