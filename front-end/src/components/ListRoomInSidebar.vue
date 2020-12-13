<template>
  <div>
    <ul class="list-room">
      <li class="room-label">
        {{ $t('sidebar.romm_label') }}
        <router-link class="add-room-btn" :to="`/room/add`">+</router-link>
      </li>
      <li v-for="(room, index) in $store.getters.getListRoom" :class="[{'active': checkActive(room.slug)}]"
        :key="index">
        <router-link :class="['room-link', {'has-notify': true}]" :to="`/room/${room.slug}`">
          {{room.name}}
          <span
            v-if="room.num_notify_mention || room.num_notify_normal"
            :class="[{'mention-num-label': room.num_notify_mention}]"
          >
            {{ getNotifySign(room.num_notify_mention, room.num_notify_normal) }}
          </span>
        </router-link>
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
  import { SERVER } from '../helper/constant';
  export default {
    created() {
      this.getListRoom()
      this.getListContact()
      this.listenCommonEventUser()
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
      },
      getNotifySign(mention = 0, normal = 0) {
        if (mention > 0) {
          return mention < 10 ? mention : '+9'
        }
        if (normal > 0) {
          return '*'
        }
        return null
      },
      listenCommonEventUser() {
        const self = this
        this.$store.dispatch('onSocket', {
          on: SERVER.EVENT_TO_COMMON_PER_USER,
          callback: function (res) {
            const type = res.type
            switch (type) {
              case SERVER.TYPE_EMIT_TO_COMMON.NEW_MESSAGE_NOTIFY:
                self.eventOnNewMessageNotify(res.result)
                break;
              case SERVER.TYPE_EMIT_TO_COMMON.REMOVE_MESSAGE_NOTIFY:
                self.eventOnRemoveMessageNotify(res.result)
                break;
              default:
                break;
            }
          }
        })
      },
      eventOnNewMessageNotify(messageNotify) {
        this.$store.commit(
          'increaseNotify',
          messageNotify.room, messageNotify.type === SERVER.TYPE_MESSAGE_NOTIFY.NORMAL ? 'normal' : 'mention'
        )
        
      },
      eventOnRemoveMessageNotify(messageNotify) {
        this.$store.commit(
          'decreaseNotify',
          messageNotify.room, messageNotify.type === SERVER.TYPE_MESSAGE_NOTIFY.NORMAL ? 'normal' : 'mention'
        )
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