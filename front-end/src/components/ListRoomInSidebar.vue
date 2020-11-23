<template>
  <div>
    <ul class="list-room">
      <li class="room-label">
        {{ $t('sidebar.romm_label') }}
        <router-link class="add-room-btn" :to="`/room/add`">+</router-link>
      </li>
      <li v-for="(room, index) in $store.getters.getListRoom" :class="[{'active': checkActive(room.slug)}]"
        :key="index">
        <router-link class="room-link" :to="`/room/${room.slug}`">{{room.name}}</router-link>
      </li>
    </ul>
    <ul class="list-room">
      <li class="room-label">
        {{ 'Contact' }}
      </li>
      <li v-for="(userContact, index) in $store.getters.userContacts"
        :class="[{'active': checkActive(userContact.room.slug)}]" :key="index">
        <router-link class="room-link" :to="`/contact/${userContact.room.slug}`">
          {{userContact.user.fullname}}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    created() {
      this.getListRoom()
      this.getListContact()
    },
    methods: {
      getListRoom() {
        this.$store.dispatch('getListRoomByUser').then((res) => {
          this.$store.commit('setListRoom', res.data)
        })
      },
      getListContact() {
        this.$store.dispatch('getListContactByUser').then(res => {
          this.$store.commit('setListContact', res.data)
        })
      }
    },
    computed: {
      checkActive: function () {
        return (slug) => {
          if (this.$route.name === 'Room' && this.$route.params.slug === slug) {
            return true
          }
          if (this.$route.name === 'Contact' && this.$route.params.slug === slug) {
            return true
          }
          return false
        }
      }
    },
  }
</script>

<style lang="scss">
  @import '../css/list-room-in-sidebar.module'
</style>