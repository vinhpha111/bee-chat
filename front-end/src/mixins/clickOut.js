export default {
    data() {
        return {
            clickIn: null
        }
    },
    created() {
        document.body.addEventListener('click', this.handleClickOut)
    },
    methods: {
        handleClickOut() {
            let self = this
            setTimeout(function() {
                if (self.clickIn === false) {
                    self.hasClickOut()
                } else {
                    self.clickIn = false
                }
            }, 10)
        },
    },
    destroyed() {
        document.body.removeEventListener('click', this.handleClickOut)
    },
}