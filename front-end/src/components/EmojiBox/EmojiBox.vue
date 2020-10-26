<template>
    <div @click="isClickIn = true" :class="['emoji-box', classUnique]" :style="{ top: positionY, left: positionX }" v-if="display">
        <div :class="['emoji-box-header']">
            <span v-for="(section, key) in emojiJson" :key="key+'sdf'" @click="cateSelected = key" :class="['emoji-box-header-btn', { active: cateSelected === key }]">
                {{ section.icon }}
            </span>
            <span :class="['emoji-box-header-close-btn']" @click="hide"><i class="fa fa-close"></i></span>
        </div>
        <div :class="['emoji-box-body']">
            <div v-for="(section, key) in emojiJson" :key="key" :class="['emoji-box-body-group', { 'emoji-box-body-group-show': cateSelected === key }]">
                <label v-for="(item, index) in section.data" @click="selectEmoji(item)" :key="index" :class="['emoji-box-body-group-item']">{{ item.char }}</label>
            </div>
        </div>
    </div>
</template>
<script>
import emojiJson from './emoji.json'
export default {
    data() {
        return {
            classUnique: (new Date()).getTime().toString(),
            emojiJson: emojiJson,
            cateSelected: 'Smileys & Emotion',
            display: false,
            positionX: 0,
            positionY: 0,
            isClickIn: false
        }
    },
    created() {
        document.body.addEventListener('click', this.clickOut)
    },
    methods: {
        clickOut() {
            const self = this
            setTimeout(function() {
                if (!self.isClickIn) {
                    self.hide()
                }
                self.isClickIn = false
            }, 100)
        },
        show(mouseX = null, mouseY = null) {
            const screenW = document.body.clientWidth
            const screenH = document.body.clientHeight
            const popupW = 300
            const popupH = 200
            let posX = mouseX || this.positionX
            let posY = mouseY || this.positionY
            if (screenW - mouseX < popupW) {
                posX = screenW - popupW
            }
            if (screenH - mouseY < popupH) {
                posY = screenH - popupH
            }
            this.positionX = `${posX}px`
            this.positionY = `${posY}px`
            this.display = true
            this.isClickIn = true
        },
        hide() {
            this.display = false
        },
        selectEmoji(item) {
            this.$emit('selectEmoji', item)
            this.hide()
        }
    },
    destroyed() {
        document.body.removeEventListener('click', this.clickOut)
    }
}
</script>
<style lang="scss">
.emoji-box {
    position: fixed;
    width: 300px;
    height: 200px;
    border: 1px solid gray;
    background-color: white;
    z-index: 100;
    &-header {
        height: 30px;
        width: 100%;
        &-btn {
            cursor: pointer;
            display: inline-block;
            height: 30px;
            padding: 2px 5px;
            &:hover {
                background-color: lightblue;
            }
            &.active {
                background-color: lightblue;
            }
        }
        &-close-btn {
            float: right;
            margin-right: 5px;
            cursor: pointer;
            &:hover {
                color: orangered;
            }
        }
    }
    &-body {
        height: 170px;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        border-top: 1px solid gray;
        &-group {
            display: none;
            &-item {
                display: inline-block;
                width: 29px;
                height: 29px;
                text-align: center;
                cursor: pointer;
                &:hover {
                background-color: lightblue;
                }
            }
            &-show {
                display: block;
            }
        }
    }
}
</style>