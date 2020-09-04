<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {
  },
  async created() {
    this.$store.dispatch('getUser').then(res => {
      console.log(res)
    })
  },
}
</script>
