<template>
  <div class="header-chat-box">
    <label v-if="type==='room-chat'" class="label">{{ room ? room.name : '' }}</label>
    <label v-if="type==='contact'" class="label">{{ contact ? contact.user.fullname : '' }}</label>
  </div>
</template>
<script>
  export default {
    props: ['room', 'type', 'contact']
  }
</script>
<style lang="scss">
  .header-chat-box {
    height: 39px;
    border-bottom: 1px solid goldenrod;
    background-color: #ffec87;

    .label {
      font-size: 15px;
      margin: 0;
      font-weight: bold;
      color: gray;
    }
  }
</style>