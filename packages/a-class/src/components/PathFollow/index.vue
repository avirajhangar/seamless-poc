<template>
  <svg
    width="900"
    height="200"
    viewBox="-40 0 1000 200"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <filter id="glow">
        <fegaussianblur
          class="blur"
          result="coloredBlur"
          stddeviation="5"
        ></fegaussianblur>
        <femerge>
          <femergenode in="coloredBlur"></femergenode>
          <femergenode in="coloredBlur"></femergenode>
          <femergenode in="coloredBlur"></femergenode>
          <femergenode in="SourceGraphic"></femergenode>
        </femerge>
      </filter>
    </defs>

    <path
      ref="path"
      id="path"
      class="path"
      d="M6,6 C65.4137147,6 74.4137147,134 133.837829,134 C193.230744,134 193.230744,
      6 252.634059,6 C312.047774,6 312.047774,134 371.461488,134 C430.896003,134 430.896003,
      6 490.330517,6 C549.744231,6 549.744231,134 609.168346,134 C668.623659,134 668.623659,6 728.078973,6 C787.544686,6 796.544686,134 856,134"
    />
    <path
      id="path2"
      class="path2"
      stroke="rgba(0, 173, 239, 0.5)"
      :stroke-dasharray="`${dashOffset} ${length}`"
      d="M6,6 C65.4137147,6 74.4137147,134
    133.837829,134 C193.230744,134 193.230744,6 252.634059,6 C312.047774,6
    312.047774,134 371.461488,134 C430.896003,134 430.896003,6 490.330517,6
    C549.744231,6 549.744231,134 609.168346,134 C668.623659,134 668.623659,6
    728.078973,6 C787.544686,6 796.544686,134 856,134"
    />
  </svg>
</template>
<script>
export default {
  name: 'ukscc-SVGPath',
  props: {
    width: {
      type: String,
      required: false,
      default: '24'
    },
    fill: {
      type: String,
      required: false,
      default: '#ffffff'
    },
    progress: {
      required: true,
      default: 0.5
    }
  },
  data() {
    return {
      isNotificationShowing: true,
      length: 100
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.length = this.$refs['path'].getTotalLength() || 0
    })
  },
  computed: {
    dashOffset() {
      return this.length * this.progress
    },
    height: {
      get() {
        return (this.width / 24) * 32
      }
    }
  }
}
</script>
<style lang="scss">
.path {
  fill: none;
  stroke: #fff;
  stroke-width: 1px;
  // filter: blur(1px);
}
.path2 {
  fill: none;
  stroke: rgba(0, 173, 239, 0.5);
  stroke-width: 8px;
  filter: blur(1px);
}
</style>
