<template>
  <div class="chev--down">
    <Chev />
    <Chev />
    <Chev />
    <Chev />
  </div>
</template>
<script>
import Chev from './Chev.vue'

export default {
  name: 'ukscc-ChevDown',
  components: {
    Chev
  }
}
</script>
<style lang="scss" scoped>
.chev--down {
  display: flex;
  flex-direction: column;
  align-items: center;
  &.active {
    .chev {
      opacity: 0;
      animation: pulse steps(20) 1.5s infinite;
      animation-fill-mode: both;
    }
  }

  .chev:nth-child(1) {
    opacity: 0.25;
    animation-delay: 0.2s;
  }
  .chev:nth-child(2) {
    opacity: 0.5;
    animation-delay: 0.4s;
  }
  .chev:nth-child(3) {
    opacity: 0.75;
    animation-delay: 0.6s;
  }
  .chev:nth-child(4) {
    opacity: 1;
    animation-delay: 0.8s;
  }
}

@keyframes pulse {
  0% {
    opacity: 0;
  }

  75% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
