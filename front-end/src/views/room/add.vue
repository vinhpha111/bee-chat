<template>
    <div>
        <div class="w3-container w3-blue">
            <h4>{{$t('add_room_page.title')}}</h4>
        </div>
        <br/>
        <form class="w3-container">
            <label>{{$t('add_room_page.name')}}</label>
            <input class="w3-input" type="text"><br/>
            <div>
                <label>{{$t('add_room_page.member')}}</label>
                <div @click="showFindListUser = true" class="w3-input member-input" type="text">
                    <span class="w3-tag w3-blue w3-margin-right w3-hover-red item"
                        v-for="(user, index) in listUserSelect" 
                        @click="removeSelectedUser(user, index);" :key="index">
                        {{user.fullname}} X
                    </span>
                    <i v-if="listUserSelect.length === 0" class="w3-opacity">Click there to select member</i>
                </div>
                <FindListUser :exceptIds="userListExcept" @select="selectUserInList" @close="showFindListUser = false" v-if="showFindListUser" />
            </div>
        </form>
    </div>
</template>
<script>
import FindListUser from '../../components/FindListUser'
export default {
    components: {
        FindListUser
    },
    data() {
        return {
            showFindListUser: false,
            userListExcept: [],
            listUserSelect: []
        }
    },
    methods: {
        selectUserInList(user) {
            this.userListExcept.push(user._id)
            this.listUserSelect.push(user)
        },
        removeSelectedUser(user, index) {
            delete this.listUserSelect[index]
            this.userListExcept = this.userListExcept.filter(id => id !== user._id)
            this.listUserSelect = this.listUserSelect.filter(item => item._id !== user._id)
        }
    },
}
</script>
<style lang="scss">
@import '../../css/add-room-page.module'
</style>