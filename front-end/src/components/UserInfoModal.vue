<template>
	<div class="user-info-modal" @click="clickIn = true" :style="{top, left}">
		<div class="user-info-modal-container">
			<div class="user-info-modal-container-row">
				<img class="user-info-modal-container-row-avatar" :src="userData.avatar_path || generateAvatarUrlFromName(userData.fullname)">
				<div class="user-info-modal-container-row-info">
					<p>{{userData.fullname}}</p>
					<p>{{userData.email}}</p>
				</div>
			</div>
			<router-link class="user-info-modal-container-contact-btn" to="">Contact</router-link>
		</div>
	</div>
</template>

<script>
import clickOutMixin from '../mixins/clickOut'
import generateAvatarUrlFromName from '../helper/generateAvatarUrlFromName'

export default {
	props: ['user-data'],
	mixins: [clickOutMixin],
	data() {
		return {
			top: 0,
			left: 0
		}
	},
	created() {
		const screenW = document.body.clientWidth
        const screenH = document.body.clientHeight
        const popupW = 300
        const popupH = 200
        let posX = this.userData.posX || this.left
        let posY = this.userData.posY || this.right
        if (screenW - posX < popupW) {
            posX = screenW - popupW
        }
        if (screenH - posY < popupH) {
            posY = screenH - popupH
        }
        this.left = `${posX}px`
        this.top = `${posY}px`
	},
	methods: {
        hasClickOut() {
            this.$emit('close')
		},
		generateAvatarUrlFromName: name => generateAvatarUrlFromName(name)
	}
}
</script>
