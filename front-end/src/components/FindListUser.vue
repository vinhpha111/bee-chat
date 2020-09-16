<template>
    <div @click="clickIn = true" class="list-user-box">
        <input :placeholder="$t('find_list_user.typing_name_or_email')" v-model="str" @input="loadListUser" v-if="inputPosition !== 'bottom'" class="user-typing" type="text"/>
        <ul class="w3-ul w3-border list-user">
            <li v-for="(user, index) in filterUsers" @click="selectUser(user)" :key="index" class="w3-hover-blue">
                {{user.fullname}}
            </li>
        </ul>
        <input :placeholder="$t('find_list_user.typing_name_or_email')" v-model="str" @input="loadListUser" v-if="inputPosition === 'bottom'" class="user-typing" type="text"/>
    </div>
</template>
<script>
import _ from 'lodash'
let self = null
export default {
    props: {
        inputPosition: {
            type: String,
            default: 'top'
        },
        exceptIds: Array,
        closeWhenSelect: Boolean
    },
    data() {
        return {
            listUser: [],
            str: '',
            clickIn: null
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
            const query = {
                str: self.str,
                exceptIds: self.exceptIds
            }
            self.listUser = (await self.$store.dispatch('findUserByString', query)).data || []
        }, 500),
        handleClickOut: () => {
            setTimeout(() => {
                if (self.clickIn === false) {
                    self.$emit('close')
                } else {
                    self.clickIn = false
                }
            }, 10)
        },
        selectUser(user) {
            this.$emit('select', user)
            if (this.closeWhenSelect) {
                this.$emit('close')
            }
        }
    },
    computed: {
        filterUsers: () => {
            return self.listUser.filter((user) => self.exceptIds.indexOf(user._id) === -1)
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