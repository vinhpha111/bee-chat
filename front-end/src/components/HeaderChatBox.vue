<template>
    <div class="header-chat-box w3-light-blue">
        {{ room ? room.name : '' }}
    </div>
</template>
<script>
export default {
    props: ['room']
}
</script>
<style>
.header-chat-box {
    height: 40px;
}
</style>