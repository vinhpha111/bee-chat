<template>
	<div :class="['text-input', classUnique]">
		<div :class="['text-input-toolbar']">
			<a :class="['icon', { 'selected': toolBarActive.italic.active}]" href="javascript:void(0)" @click="format('italic'); toolBarActive.italic.active = !toolBarActive.italic.active"><i class="fa fa-italic"></i></a>
			<a :class="['icon', { 'selected': toolBarActive.bold.active}]" href="javascript:void(0)" @click="format('bold'); toolBarActive.bold.active = !toolBarActive.bold.active"><i class="fa fa-bold"></i></a>
			<a :class="['icon', { 'selected': toolBarActive.link.active}]" href="javascript:void(0)"><i class="fa fa-link"></i></a>
			<a :class="['icon', { 'selected': toolBarActive.insertunorderedlist.active}]" href="javascript:void(0)" @click="format('insertunorderedlist'); toolBarActive.insertunorderedlist.active = !toolBarActive.insertunorderedlist.active"><i class="fa fa-list-ul"></i></a>
			<a :class="['icon', { 'selected': toolBarActive.formatBlock.active}]" href="javascript:void(0)" @click="format('formatBlock', 'blockquote'); toolBarActive.formatBlock.active = !toolBarActive.formatBlock.active"><i class="fa fa-quote-left"></i></a>
			<a :class="['icon', 'icon-smile']" href="javascript:void(0)" @click="showEmojiBox"><i class="fa fa-smile-o"></i></a>
		</div>
		<div @click="checkActiveToolbar(); updateCurentSelection()" @keyup="checkActiveToolbar(); updateCurentSelection()" @input="emitHtml" id="htmlContent" contenteditable="true" class="text-input-editor">
		</div>
		<EmojiBox @selectEmoji="selectEmoji" ref="emoji-box"/>
	</div>
</template>
<script>
import $ from 'jquery'
import _ from 'lodash'
import EmojiBox from './EmojiBox/EmojiBox'
export default {
	props: ['value'],
	components: {
		EmojiBox
	},
	data() {
		return {
			htmlContent: '',
			cursorPos: 0,
			classUnique: (new Date()).getTime().toString(),
			toolBarActive: {
				italic: {
					selector: "i",
					active: false
				},
				bold: {
					selector: "b",
					active: false
				},
				link: {
					selector: "a",
					active: false
				},
				insertunorderedlist: {
					selector: "ul",
					active: false
				},
				formatBlock: {
					selector: "blockquote",
					active: false
				}
			},
			currentRange: null,
			currentOffset: null
		}
	},
	created() {
		this.updateHtml(this.value)
		this.emitHtml()
	},
	methods: {
		format(type, value = null) {
			document.execCommand(type, false, value)
			$("#htmlContent *").removeAttr('style');
			if (type === "formatBlock" && this.toolBarActive.formatBlock.active) {
				document.execCommand('formatBlock', false, '<div>')
			}
			$('#htmlContent').focus()
		},
		updateHtml() {
			this.htmlContent = $("#htmlContent").html()
		},
		checkActiveToolbar: _.debounce(function() {
			for (let i in this.toolBarActive) {
				this.toolBarActive[i]['active'] = this.caretIsChildIn(this.toolBarActive[i]['selector'])
			}
		}, 100),
		caretIsChildIn(selector) {
			let sel = null,
				range = null
			if (window.getSelection && (sel = window.getSelection()).rangeCount) {
				range = sel.getRangeAt(0);
				if ($(range.startContainer).closest(selector).length > 0) {
					return true
				}
			}
			return false
		},
		emitHtml() {
			this.htmlContent = $('#htmlContent').html()
			this.$emit('input', this.htmlContent)
			const height = $(`.${this.classUnique} .text-input-toolbar`).outerHeight() + $(`.${this.classUnique} .text-input-editor`).outerHeight()
			$(`.${this.classUnique}`).height(height+'px')
			this.$emit('updateHeight', height)
		},
		updateCurentSelection() {
			let sel
			if (window.getSelection) {
				sel = window.getSelection()
				this.currentRange = sel.getRangeAt(0)
				this.currentOffset = sel.focusOffset
			}
		},
		getHtml() {
			return this.htmlContent
		},
		setHtml(html) {
			this.htmlContent = html
			$('#htmlContent').html(html)
			this.emitHtml()
		},
		selectEmoji(emoji) {
			this.pasteHtmlAtCaret(emoji.char)
		},
		pasteHtmlAtCaret(html, spaceReplace = 0) {
			var sel, range;
			if (!this.currentRange) {
				$('#htmlContent').focus()
				this.updateCurentSelection()
			}
			if (window.getSelection) {
				// IE9 and non-IE
				sel = window.getSelection()
				if (sel.getRangeAt && sel.rangeCount) {
					range = this.currentRange
					range.setStart(range.startContainer, this.currentOffset - spaceReplace)
					range.setEnd(range.startContainer, this.currentOffset)
					console.log(range)
					range.deleteContents();

					var el = document.createElement("span");
					el.innerHTML = html;
					var frag = document.createDocumentFragment(), node, lastNode;
					while ( (node = el.firstChild) ) {
						lastNode = frag.appendChild(node);
					}
					range.insertNode(frag);
					
					if (lastNode) {
						range = range.cloneRange();
						range.setStartAfter(lastNode);
					}
				}
			} else if ( (sel = document.selection) && sel.type != "Control") {
				// IE < 9
				var originalRange = sel.createRange();
				originalRange.collapse(true);
				sel.createRange().pasteHTML(html);
			}
			this.emitHtml()
		},
		showEmojiBox(event) {
			this.$refs['emoji-box'].show(event.clientX, event.clientY)
		}
	}
}
</script>