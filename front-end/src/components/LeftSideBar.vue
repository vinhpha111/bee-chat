<template>
    <div class="">
        <div class="header">
            <img class="avatar" :src="$store.getters.getUserInfo ? ( $store.getters.getUserInfo.avatar_path || getAvatarByName($store.getters.getUserInfo.fullname) ) : ''">
            <label class="username">{{$store.getters.getUserInfo ? $store.getters.getUserInfo.fullname : ''}}</label>
            <i @click="showAccountDropdown = true" class="fa fa-gear option"></i>
            <optionAccountDropdown @close="showAccountDropdown = false" v-if="showAccountDropdown"/>
        </div>
        <div class="main">
            <div class="saved-item"><router-link :to="''"><i class="fa fa-star-o"></i>{{$t('sidebar.saved_link')}}</router-link></div>
            <ListRoomInSidebar/>
        </div>
        <div class="footer">
            <i>Develop by: vinhpha111@gmail.com </i>
        </div>
    </div>
</template>

<script>
import ListRoomInSidebar from './ListRoomInSidebar'
import optionAccountDropdown from './optionAccountDropdown'
import generateAvatarUrlFromName from '../helper/generateAvatarUrlFromName'
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
    computed: {
        getAvatarByName() {
            return name => generateAvatarUrlFromName(name)
        }
    }

}
</script>