<template>
  <div class="auth-page">
    <div class="login-box">
      <div class="login-box__header">Login</div>
      <div class="login-box__main">
        <i v-if="errors.not_exist_user" class="error-validation">{{errors.not_exist_user}}</i>
        <div class="login-box__main__row">
          <label class="login-box__main__row__label">Email</label>
          <div class="login-box__main__row__input">
            <input class="w3-input w3-border" type="text" v-model="email">
            <i v-if="errors.email" class="error-validation">{{errors.email}}</i>
          </div>
        </div>
        <div class="login-box__main__row">
          <label class="login-box__main__row__label">Password</label>
          <div class="login-box__main__row__input">
            <input type="password" class="w3-input w3-border" v-model="password">
            <i v-if="errors.password" class="error-validation">{{errors.password}}</i>
          </div>
        </div>
        <button @click="login" class="login-box__main__submit-btn">Let login</button>
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
          this.$router.go({
            name: 'Home'
          })
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