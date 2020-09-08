<template>
    <div class="w3-border">
        <div class="header w3-teal">
            <h5>Headerlabel</h5>
        </div>
        <div class="main">
            <ul class="w3-ul w3-border">
                <li class="w3-green w3-center">{{ $t('sidebar.romm_label') }}</li>
                <li v-for="(room, index) in listRoom" :key="index">
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
            listRoom: []
        }
    },
    created() {
        this.getListRoom()
    },
    methods: {
        getListRoom() {
            this.$store.dispatch('getListRoomByUser').then((res) => {
                this.listRoom = res.data
            })
        }
    },
}
</script>