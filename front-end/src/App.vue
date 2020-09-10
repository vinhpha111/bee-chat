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
  }
}
</script>

<style lang="scss">
  @import './css/main.module.scss'
</style>