<template>
	<div class="reply-message" v-if="messageReply">
		<div class="reply-message-header">
			<p class="label">Reply message</p>
			<i @click="close()" class="fa fa-close close-btn"></i>
		</div>
		<div class="reply-message-main">
			<MessageRow :message="messageReply" :is-thread="true"/>
			<!-- <MessageRow v-for="(child, index) in messageReply.childrens" :key="index" :message="child" :is-thread="true"/> -->
			<ListMessage v-if="messageReply.childrens" ref="listMsg" type="reply" :messages="messageReply.childrens" />
			<FooterChatBox type="reply" :message="messageReply" />
		</div>
	</div>
</template>

<script>
import MessageRow from '../MessageRow'
import FooterChatBox from '../FooterChatBox'
import eventBus from '../../helper/eventBus'
import ListMessage from '../ListMessage'
export default {
	components: {
		MessageRow,
		FooterChatBox,
		ListMessage
	},
	data() {
		return {
			messageReply: null
		}
	},
	async mounted() {
		await this.init()
		const self = this
		eventBus.$on('initReplyMessage', function() {
			self.init()
		})
	},
	methods: {
		async init() {
			this.messageReply = null //this.$store.getters.getMessageReply
			this.messageReply = await this.$store.dispatch('getMessageById', this.$store.getters.getMessageReply._id).then(res => res.data)
			// return msg
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
		border: 1px solid goldenrod;
        background-color: #ffec87;
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

	&-main {
		max-height: calc(100vh - 40px);
		overflow-y: auto;
	}
}
</style>

<style lang="sass">
@import '../../css/chat-list.module';
</style>