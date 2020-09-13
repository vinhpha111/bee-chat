<template>
  <div>
      <ul class="w3-ul w3-border list-room">
          <li class="w3-green w3-center">
              {{ $t('sidebar.romm_label') }}
              <router-link  class="add-room-btn" :to="`/room/add`">+</router-link>
          </li>
          <li v-for="(room, index) in $store.getters.getListRoom" :key="index">
              <router-link :to="`/room/${room.slug}`">{{room.name}}</router-link>
          </li>
      </ul>
  </div>
</template>

<script>
export default {
  created() {
      this.getListRoom()
  },
  methods: {
    getListRoom() {
        this.$store.dispatch('getListRoomByUser').then((res) => {
            this.$store.commit('setListRoom', res.data)
        })
    }
  },
}
</script>
<style lang="scss">
@import '../css/list-room-in-sidebar.module'
</style>