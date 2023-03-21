<template>
  <div class="sectonEndframe">
    <div class="sectonEndframe__container">
      <div class="message-container">
      </div>
    </div>
  </div>
</template>

<script>
import Message from '../Message.vue'

export default {
  name: 'ukscc-sectonEndframe',
  components: {
    Message,
  },
  computed: {
    message() {
      let greeting = this.$appData.eqs['section-endframe'].title
      let name = this.userinfo.name
      if (name.length) {
        return `${greeting}, </br> <span style='color: #e5007d;'>${this.userinfo.name}.</span>`
      }
      return `${greeting}.`
    }
  }
}
</script>

<style lang="scss">
.sectonEndframe {
  position: relative;
  left: 0;
  top: 0;
  min-height: 100vh;
  overflow: hidden;
  min-width: 100vw;
  pointer-events: none;
  .sectonEndframe__container {
    display: flex;
    flex-direction: row;
    align-content: center;
    height: 100vh;
    background-image: url('~@/assets/images/section-endframe/endframe-hi.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-color: transparent;
    background-position: center;

    .message-container {
      display: flex;
      width: 55%;
      .logo {
        padding-bottom: 6px;
      }
      .message {
        align-self: center;
        margin: 0 auto;
      }
      .cta {
        margin: auto;
        &.cta--personal {
          // margin: 20px 0px 20px 0px;
          @include mobile-small-landscape() {
            margin: 0;
          }
        }
        .btn {
          padding: 4px 10px;
          margin: 10px 10px;
          @include desktopDevice() {
            padding: 4px 20px;
          }
          @include mobile-small-landscape() {
            padding: 0 10px;
          }
        }
      }
    }
  }
}
</style>
