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