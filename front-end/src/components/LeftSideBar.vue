<template>
    <div class="w3-border">
        <div class="header w3-teal">
            <h5>{{$store.getters.getUserInfo ? $store.getters.getUserInfo.fullname : ''}}</h5>
        </div>
        <div class="main">
            <ul class="w3-ul w3-border">
                <li><router-link :to="''">{{$t('sidebar.saved_link')}}</router-link><img class="w3-right" src="../assets/images/star-icon.png"></li>
            </ul>
            <ListRoomInSidebar/>
        </div>
        <div class="footer w3-pale-green">
            <i>Develop by: vinhpha111@gmail.com </i>
        </div>
    </div>
</template>

<script>
import ListRoomInSidebar from './ListRoomInSidebar'
export default {
    components: {
        ListRoomInSidebar
    },
    data() {
        return {
        }
    }
}
</script>