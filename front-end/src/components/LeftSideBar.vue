<template>
    <div class="w3-border">
        <div class="header w3-teal">
            <h5>{{$store.getters.getUserInfo.fullname}}</h5>
        </div>
        <div class="main">
            <ul class="w3-ul w3-border">
                <li><router-link :to="''">{{$t('sidebar.saved_link')}}</router-link><img class="w3-right" src="../assets/images/star-icon.png"></li>
            </ul>
            <ul class="w3-ul w3-border">
                <li class="w3-green w3-center">{{ $t('sidebar.romm_label') }}</li>
                <li v-for="(room, index) in $store.getters.getListRoom" :key="index">
                    <router-link :to="`/room/${room.slug}`">{{room.name}}</router-link>
                </li>
            </ul>
        </div>
        <div class="footer w3-pale-green">
            <i>Develop by: vinhpha111@gmail.com </i>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
        }
    },
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