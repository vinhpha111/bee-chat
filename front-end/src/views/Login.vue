<template>
    <div class="auth-page">
        <div class="login-box">
            <div class="w3-container w3-teal">
                <h4 class="w3-center">Login</h4>
            </div>
            <div>
                <i v-if="errors.not_exist_user" class="w3-text-red">{{errors.not_exist_user}}</i><p/>
                <label class="w3-text-blue">Email</label>
                <input class="w3-input w3-border" type="text" v-model="email">
                <i v-if="errors.email" class="w3-text-red">{{errors.email}}</i><p/>
                <label class="w3-text-blue">Password</label>
                <input type="password" class="w3-input w3-border" v-model="password">
                <i v-if="errors.password" class="w3-text-red">{{errors.password}}</i>
                <p/>
                <button @click="login" class="w3-btn w3-green w3-block">Let login</button>
            </div>
        </div>
    </div>
</template>
<script>
import parseError from '../helper/parseValidateError'
export default {
    data() {
        return {
            email: '',
            password: '',
            errors: {}
        }
    },
    methods: {
        login() {
            const dataSubmit = {
                email: this.email,
                password: this.password
            }
            this.$store.commit('setLoading', true)
            this.$store.dispatch('loginUser', dataSubmit)
                .then(() => {
                    this.$store.commit('setLoading', false)
                    this.$router.push({ name: 'Home' })
                })
                .catch(err => {
                    const errorData = err.response
                    if (errorData.status === 422) {
                        this.errors = parseError(errorData.data.errors)
                        console.log(this.errors)
                    }
                    this.$store.commit('setLoading', false)
                })
        }
    }
}
</script>
<style lang="scss">
@import '../css/user-auth.module.scss';
</style>