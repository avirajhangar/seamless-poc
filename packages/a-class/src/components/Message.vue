<template>
  <div class="message">
    <div class="content">
      <h2 v-html="title" />
      <p v-if="subtitle" v-html="subtitle" />
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ukscc-message',
  props: {
    isEQ: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    subtitle: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
.message {
  display: flex;
  flex-direction: column;
  align-self: start;
  pointer-events: none;
  color: #000000;
  text-align: left;
  height: calc(100% - 80px);
  margin: 20px;
  z-index: 1;
  position: relative;
  .content {
    //margin: auto;
    z-index: 2;
  }
  //.logo {
  //  width: 15vw;
  //  max-width: 350px;
  //  margin: 0px auto;
  //  &.eqs {
  //    max-width: 60px;
  //  }
  //  &--eq {
  //    margin: -10px 0 auto 0;
  //  }
  //  img {
  //    max-width: 100%;
  //    margin-bottom: 4px;
  //  }
  //}

  p {
    font-size: calc(min(max(13px, 1.4vw), 17px));
    line-height: calc(min(max(13px, 1.6vw), 17px));
    //margin: 10px auto 5px auto;
    max-width: 350px;
  }
  .star {
    margin-top: 15px;
  }
  h2 {
    letter-spacing: 2px;
  }
}
</style>
