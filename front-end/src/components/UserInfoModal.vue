<template>
  <div class="user-info-modal" @click="clickIn = true" :style="{top, left}">
    <div class="user-info-modal-container">
      <div class="user-info-modal-container-row">
        <img class="user-info-modal-container-row-avatar"
          :src="userData.avatar_path || generateAvatarUrlFromName(userData.fullname)">
        <div class="user-info-modal-container-row-info">
          <p>{{userData.fullname}}</p>
          <p>{{userData.email}}</p>
        </div>
      </div>
      <button v-if="$store.getters.getUserInfo._id !== userData._id" class="user-info-modal-container-contact-btn" @click="contactToUser">
        {{ $t('common.contact_btn') }}
      </button>
    </div>
  </div>
</template>

<script>
  import clickOutMixin from '../mixins/clickOut'
  import generateAvatarUrlFromName from '../helper/generateAvatarUrlFromName'

  export default {
    props: ['user-data'],
    mixins: [clickOutMixin],
    data() {
      return {
        top: 0,
        left: 0
      }
    },
    created() {
      const screenW = document.body.clientWidth
      const screenH = document.body.clientHeight
      const popupW = 300
      const popupH = 200
      let posX = this.userData.posX || this.left
      let posY = this.userData.posY || this.right
      if (screenW - posX < popupW) {
        posX = screenW - popupW
      }
      if (screenH - posY < popupH) {
        posY = screenH - popupH
      }
      this.left = `${posX}px`
      this.top = `${posY}px`
    },
    methods: {
      hasClickOut() {
        this.$emit('close')
      },
      generateAvatarUrlFromName: name => generateAvatarUrlFromName(name),
      contactToUser() {
        this.$store.dispatch('findOrCreateContactRomm', {
          fromUser: this.$store.getters.getUserInfo._id,
          toUser: this.userData._id
        }).then(res => {
          const userContact = res.data
          const existUser = this.$store.getters.userContacts.find(contact => contact.room._id === userContact.room._id )
          if (!existUser) {
            this.$store.commit('addUserContact', userContact)
          }
          this.$router.push(`/contact/${userContact.room.slug}`)
          this.$emit('close')
        })
      }
    }
  }
</script>
