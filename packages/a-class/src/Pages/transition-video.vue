<template>
  <div ref="ext" class="transition-wrap">
    <div class="transition-wrap__overlay" :style="backgroundGradient"></div>
    <div
      ref="view"
      class="canvas-wrap"
      v-bind:style="{
        top: bounds.top + 'px',
        width: bounds.width + 'px',
        height: bounds.height + 'px',
        left: bounds.left + 'px'
      }"
    >
      <!-- <image-sequence
        class="imageSequence"
        filename="STAR_WIPE_V02_000"
        folder="images/transition/"
        filetype=".png"
        ref="sequence"
        :totalFrames="totalFrames"
        :interactive="false"
        :mousewheel="false"
      ></image-sequence> -->
    </div>
  </div>
</template>

<script>
import '@/assets/web-components/image-sequence/image-sequence.js'

export default {
  name: 'ukscc-VideoTransition',

  data() {
    return {
      totalFrames: 16,
      frame: 0,
      bounds: {
        width: 1920,
        height: 1080,
        left: 0,
        top: 0
      }
    }
  },
  computed: {
    progress() {
      return (this.frame / this.totalFrames) * 100
    },
    backgroundGradient() {
      let progress = this.progress / 100
      return {
        backgroundImage: `radial-gradient(circle, rgba(0, 0, 0, ${Math.min(
          progress,
          1 - progress
        )}) 20%, black 150%)`
      }
    }
  },
  timeout: 0,
  timeoutRepeat: 0,
  mounted() {
    const imageSequence = this.$refs['sequence']
    imageSequence.mousewheel = this.mousewheel
    imageSequence.load()
    this.onWindowResize()
  },
  watch: {
    frame: function (val) {
      this.$refs['sequence'].frameIndex = Math.floor(val)
    }
  },
  methods: {
    onWindowResize() {
      if (this.$refs.view.offsetHeight > 0) {
        this.updateLayout()
      } else {
        let heightChecker = setInterval(() => {
          this.updateLayout()
          clearInterval(heightChecker)
          clearTimeout(this.resieTimeout)
          this.resieTimeout = setTimeout(this.updateLayout, 1000)
        }, 50)
      }
      clearTimeout(this.resieTimeout)
      this.resieTimeout = setTimeout(this.updateLayout, 1000)
      this.updateLayout()
    },

    updateLayout() {
      let vh = this.$refs.view.offsetHeight
      let eh = this.$refs.ext.offsetHeight
      let vw = this.$refs.view.offsetWidth
      let ew = this.$refs.ext.offsetWidth
      this.bounds.height = eh
      this.bounds.width = (1920 / 1080) * eh
      if (this.bounds.width < this.$refs.ext.offsetWidth) {
        this.bounds.width = this.$refs.ext.offsetWidth + 2
        this.bounds.height = (1080 / 1920) * this.bounds.width
        this.bounds.top = 2 + -Math.abs(eh - this.bounds.height + (vh - eh) / 2)
      }
      this.bounds.left = -Math.abs(
        (this.bounds.width - this.$refs.ext.offsetWidth) / 2
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.transition-wrap {
  width: 100%;
  height: 100%;
  background: transparent;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  pointer-events: none;
  transform: translate3d(1px, 1px, 1px);
}
.transition-wrap__overlay {
  width: 100%;
  height: 100%;
  background: transparent;

  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  // background: radial-gradient(circle, rgba(0, 0, 0, 0.4) 50%, black 150%);
}
.imageSequence {
  transform: rotate(1deg);
}
.transition-wrap {
  position: absolute;
  top: -1px;
  left: -1px;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: transparent;
  z-index: 7;
  pointer-events: none;
}
.canvas-wrap {
  position: absolute;
}
</style>
