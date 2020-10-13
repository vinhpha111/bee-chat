<template>
	<div class="sub-thread">
		<ReplyMessage v-if="$store.getters['subThread/getType'] === 'reply'"/>
		<div 
			@mousedown="startResize" @mousemove="resize" @mouseup="endResize" @mouseleave="endResize()" 
			:class="['sub-thread-drag-resize', {'resizing': isResizing}]"
		/>
	</div>
</template>

<script>
import ReplyMessage from './ReplyMessage'
import $ from 'jquery'
export default {
	name: "sub-thread",
	components: {
		ReplyMessage
	},
	data() {
		return {
			isResizing: false,
			startMouseX: null,
			startWidthSubThread: null
		}
	},
	methods: {
		startResize(event) {
			this.isResizing = true
			this.startMouseX = event.clientX
			this.startWidthSubThread = $('.sub-thread').outerWidth()
		},
		endResize() {
			this.isResizing = false
		},
		resize(event) {
			if (this.isResizing) {
				const currentMouseX = event.clientX
				const space = parseInt(this.startMouseX - currentMouseX)
				const widthSubThread = this.startWidthSubThread + space
				if (widthSubThread > 300 && widthSubThread < 500) {
					$('.sub-thread').width(this.startWidthSubThread + space)
					$('.main-thread').css({ width: `calc(100% - ${this.startWidthSubThread + space}px` })	
				}
			}
		}
	},
	destroyed() {
		$('.sub-thread').css({ width: '' })
		$('.main-thread').css({ width: '' })
	},
}
</script>

<style lang="scss" scoped>
.sub-thread {
	border-left: 1px solid lightblue;
	position: relative;
	max-width: 500px;
	min-width: 300px;
	&-drag-resize {
		position: absolute;
		width: 10px;
		height: 100%;
		left: 0;
		top: 0;
		cursor: w-resize;
		&.resizing {
			width: 100px;
			left: -50px;
			top: 0;
		}
	}
}
</style>