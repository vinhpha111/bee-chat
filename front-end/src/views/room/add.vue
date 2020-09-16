<template>
    <div>
        <div class="w3-container w3-blue">
            <h4>{{$t('add_room_page.title')}}</h4>
        </div>
        <br/>
        <div class="w3-container">
            <label>{{$t('add_room_page.name')}}</label>
            <input class="w3-input" type="text" v-model="roomName" :placeholder="$t('add_room_page.name_placeholder')"><br/>
            <div>
                <label>{{$t('add_room_page.member')}}</label>
                <div @click="showFindListUser = true" class="w3-input member-input" type="text">
                    <span class="w3-tag w3-blue w3-margin-right w3-hover-red item"
                        v-for="(user, index) in listUserSelect" 
                        @click="removeSelectedUser(user, index);" :key="index">
                        {{user.fullname}} X
                    </span>
                    <i v-if="listUserSelect.length === 0" class="w3-opacity">{{ $t('add_room_page.click_to_select_user') }}</i>
                </div>
                <FindListUser :exceptIds="userListExcept" @select="selectUserInList" @close="showFindListUser = false" v-if="showFindListUser" />
            </div>
            <div class="w3-center">
                <button @click="addRoom" :class="['w3-button w3-green w3-margin-top']">{{ $t('add_room_page.create_btn') }}</button>
            </div>
        </div>
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
            listUserSelect: [],
            roomName: '',
            saveSuccess: false
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
        },
        addRoom() {
            if (this.saveSuccess) {
                return false
            }
            this.$store.commit('setLoadingView', true)
            const data = {
                name: this.roomName,
                userList: this.listUserSelect.map(user => user._id)
            }
            this.$store.dispatch('addNewRoom', data).then(res => {
                this.saveSuccess = true
                this.$store.commit('addRoom', res.data)
                this.$router.push({ name: 'Room', params: {slug: res.data.slug} })
                this.$store.commit('setLoadingView', false)
            }).catch(error => {
                this.saveSuccess = false
                console.log(error)
                this.$store.commit('setLoadingView', false)
            })
        }
    },
}
</script>
<style lang="scss">
@import '../../css/add-room-page.module'
</style>