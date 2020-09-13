<template>
  <div id="app">
    <div class="chat-main">
      <div :class="['left-bar', {show: isShowSideBar}]">
        <img @click="isShowSideBar = !isShowSideBar" class="sidebar-toggle-btn" src="./assets/images/menu-button-sidebar.png"/>
        <LeftSideBar/>
      </div>
      <div class="right-bar w3-white">
        <router-view/>
      </div>
    </div>
    <loading-screen/>
  </div>
</template>

<script>
import LoadingScreen from './components/LoadingScreen'
import LeftSideBar from './components/LeftSideBar'
export default {
  components: {
    LoadingScreen,
    LeftSideBar
  },
  data() {
    return {
      isShowSideBar: false
    }
  },
}
</script>

<style lang="scss">
  @import './css/main.module.scss'
</style>