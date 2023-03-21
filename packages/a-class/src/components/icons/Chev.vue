<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 16 10"
    class="chev"
  >
    <g id="Button-Group">
      <polygon
        id="arrow-right"
        :fill="fill"
        points="16 0 16 2.44 7.94 9.33 0 2.49 0 0.06 7.94 6.08 16 0"
      />
    </g>
  </svg>
</template>
<script>
export default {
  name: 'ukscc-Chev',
  props: {
    width: {
      type: String,
      required: false,
      default: '16'
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
        return (this.width / 10) * 10
      }
    }
  }
}
</script>
