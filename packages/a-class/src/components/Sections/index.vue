<template>
  <section>
    <div class="scene">
      <slot />
    </div>
  </section>
</template>

<script>
export default {
  name: 'ukscc-Section'
}
</script>
<style lang="scss" scoped>
section {
  height: 100vh;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
  overflow: hidden;
  .scene {
    position: relative;
    width: 100%;
    height: 100vh
  }
  &.fullheight {
    .scene {
      height: 100%;
    }
  }
}
</style>
