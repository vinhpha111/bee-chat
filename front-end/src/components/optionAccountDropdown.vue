<template>
    <div class="option-dropdown" @click="clickIn = true">
        <ul>
            <li @click="$router.push({name: 'user.add'}); $emit('close')"><i class="fa fa-user-plus"></i> {{ $t('sidebar.add_user') }}</li>
            <li @click="$router.push({name: 'account.edit'}); $emit('close')"><i class="fa fa-edit"></i> {{ $t('sidebar.edit_account') }}</li>
            <li @click="logout(); $emit('close')"><i class="fa fa-sign-out"></i> {{ $t('sidebar.logout') }}</li>
        </ul>
    </div>
</template>
<script>
import clickOutMixin from '../mixins/clickOut'
export default {
    mixins: [clickOutMixin],
    methods: {
        hasClickOut() {
            this.$emit('close')
        },
        logout() {
            this.$store.dispatch('logoutUser').then(() => {
                this.$router.push({name: 'Login'})
            })
        }
    },
}
</script>

<style lang="scss" scoped>
.option-dropdown {
    color: black;
    position: absolute;
    right: 5px;
    top: 5px;
    background-color: white;
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        li {
            cursor: pointer;
            padding: 4px 10px;
            font-size: 12px;
            &:nth-child(n + 2) {
                border-top: 1px solid darkgray;
            }
            &:hover {
                background-color: lightblue;
            }
        }
    }
}
</style>