<template>
	<div class="reply-message">
		<div class="reply-message-header">
			<p class="label">Reply message</p>
			<i @click="close()" class="fa fa-close close-btn"></i>
		</div>
		<MessageRow :message="messageReply" :is-thread="true"/>
		<hr class="w3-topbar w3-border-blue">
		<MessageRow v-for="(child, index) in messageReply.childrens" :key="index" :message="child" :is-thread="true"/>
		<TextInputChat />
	</div>
</template>

<script>
import TextInputChat from '../TextInputChat'
import MessageRow from '../MessageRow'
import eventBus from '../../helper/eventBus'
export default {
	components: {
		TextInputChat,
		MessageRow
	},
	data() {
		return {
			messageReply: null
		}
	},
	mounted() {
		this.init()
		const self = this
		eventBus.$on('initReplyMessage', function() {
			self.init()
		})
	},
	methods: {
		init() {
			this.messageReply = this.$store.getters.getMessageReply
		},
		close() {
			this.$store.commit('setMessageReply', null)
			this.$store.commit('subThread/setType', null)
		}
	},
}
</script>

<style lang="scss">
.reply-message {
	&-header {
		height: 30px;
		background-color: mediumturquoise;
		padding-left: 10px;
		position: relative;
		padding-top: 3px;
		.label {
			font-size: 15px;
			color: white;
			margin: 0;
			font-weight: bold;
		}
		.close-btn {
			position: absolute;
			font-size: 14px;
			right: 5px;
			top: 8px;
			cursor: pointer;
			&:hover {
				color: white;
			}
		}
	}
}
</style>

<style lang="sass">
@import '../../css/chat-list.module';
</style>