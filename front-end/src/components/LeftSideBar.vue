<template>
    <div class="">
        <div class="header">
            <label>{{$store.getters.getUserInfo ? $store.getters.getUserInfo.fullname : ''}}</label>
            <i @click="showAccountDropdown = true" class="fa fa-gear option"></i>
            <optionAccountDropdown @close="showAccountDropdown = false" v-if="showAccountDropdown"/>
        </div>
        <div class="main">
            <div class="saved-item"><router-link :to="''"><i class="fa fa-star-o"></i>{{$t('sidebar.saved_link')}}</router-link></div>
            <ListRoomInSidebar/>
        </div>
        <div class="footer w3-pale-green">
            <i>Develop by: vinhpha111@gmail.com </i>
        </div>
    </div>
</template>

<script>
import ListRoomInSidebar from './ListRoomInSidebar'
import optionAccountDropdown from './optionAccountDropdown'
export default {
    components: {
        ListRoomInSidebar,
        optionAccountDropdown
    },
    data() {
        return {
            showAccountDropdown: false
        }
    },

}
</script>