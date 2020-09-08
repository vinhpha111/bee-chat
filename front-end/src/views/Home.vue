<template>
  <div class="chat-main">
    <div :class="['left-bar', {show: isShowSideBar}]">
      <img @click="isShowSideBar = !isShowSideBar" class="sidebar-toggle-btn" src="../assets/images/menu-button-sidebar.png"/>
      <LeftSideBar/>
    </div>
    <div class="right-bar w3-light-gray">
      <router-view/>
    </div>
  </div>
</template>

<script>
import LeftSideBar from '../components/LeftSideBar'
export default {
  name: 'Home',
  components: {
    LeftSideBar
  },
  data() {
    return {
      isShowSideBar: false
    }
  },
  async created() {
    
  },
}
</script>
