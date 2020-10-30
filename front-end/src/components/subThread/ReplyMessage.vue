<template>
	<div class="reply-message" v-if="messageReply">
		<div class="reply-message-header">
			<p class="label">Reply message</p>
			<i @click="close()" class="fa fa-close close-btn"></i>
		</div>
		<MessageRow :message="messageReply" :is-thread="true"/>
		<hr>
		<MessageRow v-for="(child, index) in messageReply.childrens" :key="index" :message="child" :is-thread="true"/>
		<FooterChatBox  type="reply" />
	</div>
</template>

<script>
import MessageRow from '../MessageRow'
import FooterChatBox from '../FooterChatBox'
import eventBus from '../../helper/eventBus'
export default {
	components: {
		MessageRow,
		FooterChatBox
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
		height: 40px;
		padding-left: 10px;
		position: relative;
		padding-top: 3px;
		border: 1px solid darkgray;
		.label {
			font-size: 15px;
			margin: 0;
			font-weight: bold;
			color: gray;
		}
		.close-btn {
			position: absolute;
			font-size: 14px;
			right: 5px;
			top: 8px;
			cursor: pointer;
			&:hover {
				color: orange;
			}
		}
	}
}
</style>

<style lang="sass">
@import '../../css/chat-list.module';
</style>