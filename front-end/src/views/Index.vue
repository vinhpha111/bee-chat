<template>
  <div>
    <h1>Index</h1>
    <TextInputChat/>
    <EmojiBox/>
  </div>
</template>
<script>
import TextInputChat from '../components/TextInputChat'
import EmojiBox from '../components/EmojiBox/EmojiBox'
export default {
  name: "Index",
  components: {
    TextInputChat,
    EmojiBox
  }
}
</script>