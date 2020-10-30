<template>
    <div class="header-chat-box">
        <label class="label">{{ room ? room.name : '' }}</label>
    </div>
</template>
<script>
export default {
    props: ['room']
}
</script>
<style lang="scss">
.header-chat-box {
    height: 40px;
    border-bottom: 2px solid rgba(173, 216, 230, 0.455);
    .label {
		font-size: 15px;
		margin: 0;
		font-weight: bold;
		color: gray;
	}
}
</style>