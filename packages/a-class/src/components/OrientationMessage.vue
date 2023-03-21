<template>
  <div class="orientation-message">
    <div>
      <p v-html="message" />
      <div class="icon"><DeviceRotate width="90" /></div>
    </div>
  </div>
</template>

<script>
import DeviceRotate from '../components/icons/DeviceRotate.vue'

export default {
  name: 'ukscc-OrientationMessage',
  components: {
    DeviceRotate
  },
  computed: {
    message() {
      return this.$appData && this.$appData.ui['rotate-messsage']
    }
  }
}
</script>

<style lang="scss" scoped>
.orientation-message {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 9999;
  height: 100%;
  width: 100%;
  background-position-x: center;
  color: #ffffff;
  text-align: center;
  p {
    font-size: 1.1rem;
    line-height: 1.2rem;
    margin-bottom: 40px;
  }
}
</style>
