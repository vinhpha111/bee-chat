<template>
  <div>
    <HeaderChatBox :room="room" :type="type" :contact="contact" />
    <ListMessage type="room" />
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
        room: null,
        type: "room-chat",
        contact: null
      }
    },
    async created() {
      this.room = await this.$store.dispatch('getRoomBySlug', this.$route.params.slug).then(res => res.data)
      if (this.$route.name === 'Contact') {
        this.contact = await this.$store.dispatch(
          'getContactBySlug', this.$route.params.slug
        ).then(res => res.data)
        
        this.type = 'contact'
      }
    },
  }
</script>