<template>
<div class="loading-screen" :style="{position}">
  <div class="lds-ellipsis">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</div>
</template>
<script>
export default {
    props: ['position']
}
</script>
<style lang="scss" scoped>
.loading-screen {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100vh;
    background-color: white;
    opacity: 0.6;
    z-index: 1000;
    .lds-ellipsis {
        display: block;
        position: relative;
        width: 80px;
        height: 80px;
        margin: auto;
        margin-top: calc(50vh - 40px);
        div {
            position: absolute;
            top: 33px;
            width: 13px;
            height: 13px;
            border-radius: 50%;
            background: black;
            animation-timing-function: cubic-bezier(0, 1, 1, 0);
            &:nth-child(1) {
                left: 8px;
                animation: lds-ellipsis1 0.6s infinite;
            }
            &:nth-child(2) {
                left: 8px;
                animation: lds-ellipsis2 0.6s infinite;
            }
            &:nth-child(3) {
                left: 32px;
                animation: lds-ellipsis2 0.6s infinite;
            }
            &:nth-child(4) {
                left: 56px;
                animation: lds-ellipsis3 0.6s infinite;
            }
        }
    }
}
@keyframes lds-ellipsis1 {
    0% {
        transform: scale(0);
    }
    100% {
        transform: scale(1);
    }
}
@keyframes lds-ellipsis3 {
    0% {
        transform: scale(1);
    }
    100% {
        transform: scale(0);
    }
}
@keyframes lds-ellipsis2 {
    0% {
        transform: translate(0, 0);
    }
    100% {
        transform: translate(24px, 0);
    }
}
</style>
