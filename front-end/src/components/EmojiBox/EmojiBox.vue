<template>
  <div class="emoji-box">
    <div :class="['emoji-box-header']">
      <span v-for="(section, key) in emojiJson" :key="key+'sdf'" @click="cateSelected = key" :class="['emoji-box-header-btn']">
        {{ section.icon }}
      </span>
    </div>
    <div :class="['emoji-box-body']">
      <div v-for="(section, key) in emojiJson" :key="key" :class="['emoji-box-body-group', { 'emoji-box-body-group-show': cateSelected === key }]">
        <label v-for="(item, index) in section.data" :key="index" :class="['emoji-box-body-group-item']">{{ item.char }}</label>
      </div>
    </div>
  </div>
</template>
<script>
import emojiJson from './emoji.json'
export default {
  data() {
    return {
      emojiJson: emojiJson,
      cateSelected: 'Smileys & Emotion'
    }
  },
}
</script>
<style lang="scss">
.emoji-box {
  &-header {

  }
  &-body {
    &-group {
      display: none;
    }
    &-group-show {
      display: block;
    }
  }
}
</style>