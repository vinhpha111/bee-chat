<template>
    <div class="list-user-box" @mouseover="hoverIn = true" @mouseout="hoverIn = false">
        <input v-model="str" @input="loadListUser" v-if="inputPosition !== 'bottom'" class="user-typing" type="text"/>
        <ul class="w3-ul w3-border list-user">
            <li v-for="(user, index) in listUser" :key="index" class="w3-hover-blue">{{user.fullname}}</li>
        </ul>
        <input v-if="inputPosition === 'bottom'" class="user-typing" type="text"/>
    </div>
</template>
<script>
import _ from 'lodash'
let self = null
export default {
    props: ["inputPosition"],
    data() {
        return {
            listUser: [],
            str: '',
            hoverIn: true
        }
    },
    created() {
        self = this
        document.body.addEventListener('click', this.handleClickOut)
    },
    mounted() {
        const inputElement = document.getElementsByClassName('user-typing')[0]
        inputElement.focus()
    },
    methods: {
        loadListUser: _.debounce(async ()=> {
            self.listUser = (await self.$store.dispatch('findUserByString', self.str)).data || []
        }, 500),
        handleClickOut: () => {
            if (self.hoverIn === false) {
                self.$emit('close')
            }
        }
    },
    destroyed() {
        document.body.removeEventListener('click', this.handleClickOut)
    },
}
</script>
<style lang="scss">
.list-user-box {
    width: 300px;
    .user-typing {
        width: 100%;
    }
    .list-user {
        max-height: 200px;
        overflow-y: auto;
        li {
            cursor: pointer;
        }
    }
}
</style>