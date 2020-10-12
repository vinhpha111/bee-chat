<template>
	<div class="sub-thread">
		<h1 @click="$store.commit('subThread/setType', null)">sub thread: click here to close</h1>
	</div>
</template>

<script>
export default {
	name: "sub-thread"
}
</script>