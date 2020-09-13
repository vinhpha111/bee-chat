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
                    <b>bole 1</b>
                </div>
                <FindListUser @close="showFindListUser = false" v-if="showFindListUser" />
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
            showFindListUser: false
        }
    },
    methods: {
        inputMember() {
            console.log('zxczxczxc')
        }
    },
}
</script>
<style lang="scss">
@import '../../css/add-room-page.module'
</style>