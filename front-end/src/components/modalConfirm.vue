<template>
    <div v-if="show" class="modal-confirm">
        <div class="modal-confirm-box">
            <p>{{ message }}</p>
            <button @click="ok()" class="ok-btn">OK</button>
            <button @click="cancel()" class="cancel-btn">Cancel</button>
        </div>
    </div>
</template>
<script>
// import $ from 'jquery'
export default {
    props: ['message'],
    data() {
        return {
            show: false
        }
    },
    methods: {
        showModal() {
            this.show = true
        },
        ok() {
            this.show = false
            this.$emit('ok')
        },
        cancel() {
            this.show = false
            this.$emit('cancel')
        }
    },
}
</script>
<style lang="scss">
    .modal-confirm {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(169, 169, 169, 0.5);
        text-align: center;
        &-box {
            margin: auto;
            padding: 10px;
            display: inline-block;
            background-color: white;
            max-width: 300px;
            margin-top: 100px;
            p {
                margin: 0;
            }
            button {
                background: none;
                border: none;
                cursor: pointer;
                border-radius: 5px;
                margin: 0 5px;
                outline: none;
                &:hover {
                    text-decoration: underline;
                }
                &.ok-btn {
                    color: orangered;
                }
                &.cancel-btn {
                    color: blue;
                }
            }
        }
    }
</style>
