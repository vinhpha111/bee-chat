<template>
    <div class="auth-page">
        <div class="login-box">
            <h4 class="header">Login</h4>
            <p v-if="errors.not_exist_user" class="error">{{errors.not_exist_user}}</p>
            <div class="row">
                <label>Email:</label>
                <input v-model="email" placeholder="Email"/>
            </div>
            <p v-if="errors.email" class="error">{{errors.email}}</p>
            <div class="row">
                <label>Password:</label>
                <input v-model="password" type="password" placeholder="Password"/>
            </div>
            <p v-if="errors.password" class="error">{{errors.password}}</p>
            <div class="footer">
                <router-link class="btn btn-register" to="/register">Register</router-link>
                <button @click="login" class="btn btn-login">Let login</button>
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