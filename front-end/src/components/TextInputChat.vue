<template>
  <div :class="['text-input', classUnique]">
    <div :class="['text-input-toolbar']">
      <a :class="['icon', { 'selected': toolBarActive.italic.active}]" href="javascript:void(0)"
        @click="format('italic'); toolBarActive.italic.active = !toolBarActive.italic.active"><i
          class="fa fa-italic"></i></a>
      <a :class="['icon', { 'selected': toolBarActive.bold.active}]" href="javascript:void(0)"
        @click="format('bold'); toolBarActive.bold.active = !toolBarActive.bold.active"><i class="fa fa-bold"></i></a>
      <a :class="['icon', { 'selected': toolBarActive.link.active}]" href="javascript:void(0)"><i
          class="fa fa-link"></i></a>
      <a :class="['icon', { 'selected': toolBarActive.insertunorderedlist.active}]" href="javascript:void(0)"
        @click="format('insertunorderedlist'); toolBarActive.insertunorderedlist.active = !toolBarActive.insertunorderedlist.active"><i
          class="fa fa-list-ul"></i></a>
      <a :class="['icon', { 'selected': toolBarActive.formatBlock.active}]" href="javascript:void(0)"
        @click="format('formatBlock', 'blockquote'); toolBarActive.formatBlock.active = !toolBarActive.formatBlock.active"><i
          class="fa fa-quote-left"></i></a>
      <a :class="['icon', 'icon-smile']" href="javascript:void(0)" @click="showEmojiBox"><i
          class="fa fa-smile-o"></i></a>
      <i v-show="beingEdit" class="being-edit">being edit</i>
    </div>
    <div @click="checkActiveToolbar(); updateCurentSelection()" @keyup="checkActiveToolbar(); updateCurentSelection()"
      @input="emitHtml" :id="idUniqueDivEdit" contenteditable="true"
      :class="['text-input-editor', { 'text-input-editor__being-edit': beingEdit }]">
    </div>
    <EmojiBox @selectEmoji="selectEmoji" ref="emoji-box" />
  </div>
</template>
<script>
import $ from "jquery";
import _ from "lodash";
import EmojiBox from "./EmojiBox/EmojiBox";
export default {
  props: ["value", 'being-edit'],
  components: {
    EmojiBox,
  },
  data() {
    return {
      htmlContent: "",
      cursorPos: 0,
      classUnique: new Date().getTime().toString(),
      idUniqueDivEdit: new Date().getTime().toString(),
      toolBarActive: {
        italic: {
          selector: "i",
          active: false,
        },
        bold: {
          selector: "b",
          active: false,
        },
        link: {
          selector: "a",
          active: false,
        },
        insertunorderedlist: {
          selector: "ul",
          active: false,
        },
        formatBlock: {
          selector: "blockquote",
          active: false,
        },
      },
      currentSelection: {
        start: 0,
        end: 0,
      },
    };
  },
  created() {
    this.updateHtml(this.value);
    this.emitHtml();
  },
  methods: {
    format(type, value = null) {
      this.replaceSelection();
      document.execCommand(type, false, value);
      $("#htmlContent *").removeAttr("style");
      if (
        type === "formatBlock" &&
        this.toolBarActive.formatBlock.active
      ) {
        document.execCommand("formatBlock", false, "<div>");
      }
      this.updateCurentSelection();
    },
    updateHtml() {
      this.htmlContent = $("#htmlContent").html();
    },
    checkActiveToolbar: _.debounce(function () {
      for (let i in this.toolBarActive) {
        this.toolBarActive[i]["active"] = this.caretIsChildIn(
          this.toolBarActive[i]["selector"]
        );
      }
    }, 100),
    caretIsChildIn(selector) {
      let sel = null,
        range = null;
      if (
        window.getSelection &&
        (sel = window.getSelection()).rangeCount
      ) {
        range = sel.getRangeAt(0);
        if ($(range.startContainer).closest(selector).length > 0) {
          return true;
        }
      }
      return false;
    },
    emitHtml() {
      this.htmlContent = $(`#${this.idUniqueDivEdit}`).html();
      this.$emit("input", this.htmlContent);
      const height =
        $(`.${this.classUnique} .text-input-toolbar`).outerHeight() +
        $(`.${this.classUnique} .text-input-editor`).outerHeight();
      $(`.${this.classUnique}`).height(height + "px");
      this.$emit("updateHeight", height);
    },
    updateCurentSelection() {
      let containerEl = document.getElementById(
        `${this.idUniqueDivEdit}`
      );
      if (window.getSelection && document.createRange) {
        let range = window.getSelection().getRangeAt(0);
        let preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(containerEl);
        preSelectionRange.setEnd(
          range.startContainer,
          range.startOffset
        );
        let start = preSelectionRange.toString().length;

        this.currentSelection = {
          start: start,
          end: start + range.toString().length,
        };
      } else if (document.selection && document.body.createTextRange) {
        let selectedTextRange = document.selection.createRange();
        let preSelectionTextRange = document.body.createTextRange();
        preSelectionTextRange.moveToElementText(containerEl);
        preSelectionTextRange.setEndPoint(
          "EndToStart",
          selectedTextRange
        );
        let start = preSelectionTextRange.text.length;

        this.currentSelection = {
          start: start,
          end: start + selectedTextRange.text.length,
        };
      }
    },
    replaceSelection() {
      let savedSel = this.currentSelection;
      let containerEl = document.getElementById(
        `${this.idUniqueDivEdit}`
      );
      if (window.getSelection && document.createRange) {
        let charIndex = 0,
          range = document.createRange();
        range.setStart(containerEl, 0);
        range.collapse(true);
        let nodeStack = [containerEl],
          node,
          foundStart = false,
          stop = false;

        while (!stop && (node = nodeStack.pop())) {
          if (node.nodeType == 3) {
            let nextCharIndex = charIndex + node.length;
            if (
              !foundStart &&
              savedSel.start >= charIndex &&
              savedSel.start <= nextCharIndex
            ) {
              range.setStart(node, savedSel.start - charIndex);
              foundStart = true;
            }
            if (
              foundStart &&
              savedSel.end >= charIndex &&
              savedSel.end <= nextCharIndex
            ) {
              range.setEnd(node, savedSel.end - charIndex);
              stop = true;
            }
            charIndex = nextCharIndex;
          } else {
            let i = node.childNodes.length;
            while (i--) {
              nodeStack.push(node.childNodes[i]);
            }
          }
        }

        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } else if (document.selection && document.body.createTextRange) {
        let textRange = document.body.createTextRange();
        textRange.moveToElementText(containerEl);
        textRange.collapse(true);
        textRange.moveEnd("character", savedSel.end);
        textRange.moveStart("character", savedSel.start);
        textRange.select();
      }
    },
    getHtml() {
      return this.htmlContent;
    },
    setHtml(html) {
      this.htmlContent = html;
      $(`#${this.idUniqueDivEdit}`).html(html);
      this.emitHtml();
    },
    selectEmoji(emoji) {
      this.pasteHtmlAtCaret(emoji.char);
    },
    pasteHtmlAtCaret(html) {
      this.replaceSelection();
      document.execCommand("insertHTML", true, html);
      this.emitHtml();
      this.updateCurentSelection();
    },
    showEmojiBox(event) {
      this.$refs["emoji-box"].show(event.clientX, event.clientY);
    },
  },
};
</script>
