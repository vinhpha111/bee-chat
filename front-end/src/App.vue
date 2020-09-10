<template>
  <div id="app">
    <router-view/>
    <loading-screen/>
  </div>
</template>

<script>
import LoadingScreen from './components/LoadingScreen'
export default {
  components: {
    LoadingScreen
  },
  async created() {
    await this.$store.dispatch('instanceSocket', 'http://localhost:4000').then(function(){
      console.log('has connect socket');
    })
    this.$store.dispatch('emitSocketCallback', {on: 'join', token: this.$store.getters.getToken}).then(res => {
      console.log(res)
    }).catch(function(err){
      console.log(err)
    })
  },
}
</script>

<style lang="scss">
  @import './css/main.module.scss'
</style>