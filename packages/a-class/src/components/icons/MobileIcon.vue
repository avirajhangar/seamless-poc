<template>
  <img :src="require('../../assets/images/ui/360_motion_2.png')" :height="height" alt="">
</template>
<script>
export default {
  name: 'ukscc-MobileIcon',
  props: {
    width: {
      type: String,
      required: false,
      default: '21'
    },
    fill: {
      type: String,
      required: false,
      default: '#FFF'
    }
  },
  computed: {
    height: {
      get() {
        return (this.width / 15) * 24
      }
    }
  }
}
</script>
