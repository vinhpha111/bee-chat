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