<template>
  <ul v-if="isShow" @click="clickIn = true" class="more-option__dropdown">
    <li><i class="fa fa-bookmark-o"></i> {{ $t('message_item.more_option.save') }}</li>
    <li v-if="isOwner" @click="edit()"><i class="fa fa-edit"></i> {{ $t('message_item.more_option.edit') }}</li>
    <li><i class="fa fa-copy"></i> {{ $t('message_item.more_option.copy') }}</li>
    <li v-if="isOwner" style="color: red;"><i class="fa fa-remove"></i> {{ $t('message_item.more_option.delete') }}</li>
  </ul>
</template>

<script>
  import clickOutMixin from '../mixins/clickOut'
  export default {
    mixins: [clickOutMixin],
    props: {
      isOwner: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isShow: false
      }
    },
    methods: {
      hasClickOut() {
        this.hide()
      },
      show() {
        let self = this
        setTimeout(function() {
          self.isShow = true
        }, 20)
      },
      hide() {
        this.isShow = false
      },
      edit() {
        this.$emit('edit')
        this.hide()
      }
    }
  }
</script>
