<template>
  <div class="chat-main">
    <div :class="['left-bar', {show: isShowSideBar}]">
      <img @click="isShowSideBar = !isShowSideBar" class="sidebar-toggle-btn" src="../assets/images/menu-button-sidebar.png"/>
      this is side bar
    </div>
    <div class="right-bar">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {
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
