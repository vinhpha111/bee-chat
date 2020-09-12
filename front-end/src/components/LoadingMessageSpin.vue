<template>
  <div class="lds-facebook"><div></div><div></div><div></div></div>
</template>
<style scoped>
  /* get from https://loading.io/css/ */
  .lds-facebook {
    position: relative;
    width: 80px;
    height: 20px;
    margin: auto;
  }
  .lds-facebook div {
    display: inline-block;
    position: absolute;
    left: 8px;
    width: 8px;
    background:#2196F3;
    animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
  }
  .lds-facebook div:nth-child(1) {
    left: 8px;
    animation-delay: -0.24s;
  }
  .lds-facebook div:nth-child(2) {
    left: 32px;
    animation-delay: -0.12s;
  }
  .lds-facebook div:nth-child(3) {
    left: 56px;
    animation-delay: 0;
  }
  @keyframes lds-facebook {
    0% {
      top: 0px;
      height: 32px;
    }
    50%, 100% {
      top: 11px;
      height: 16px;
    }
  }
</style>