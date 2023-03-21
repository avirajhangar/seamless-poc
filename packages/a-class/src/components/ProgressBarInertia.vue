<template>
  <div id="progressbar" ref="progressbar" @click="onClickTrack">
    <div
      ref="progressbar__handle"
      id="progressbar__handle"
      class="progressbar__handle"
    ></div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import Draggable from 'gsap/Draggable'
import InertiaPlugin from 'gsap/InertiaPlugin'
gsap.registerPlugin(Draggable, InertiaPlugin)
export default {
  name: 'ukscc-ProgressBar',
  props: {
    value: {
      required: true
    },
    snapPoints: {
      type: Array
    }
  },
  data() {
    return {
      isDragging: false,
      offsets: []
    }
  },
  dragger: null,
  handleWidth: null,
  timeout: null,
  watch: {
    value: function (val) {
      if (!this.isDragging) {
        this.setProgress(val)
      }
    }
  },
  tween: null,
  mounted() {
    this.handleWidth = this.$refs['progressbar__handle'].offsetWidth
    this.dragger = Draggable.create('#progressbar__handle', {
      type: 'x',
      edgeResistance: 1,
      inertia: true,
      throwResistance: 10000,
      lockAxis: true,
      bounds: '#progressbar',
      onDrag: this.onDrag,
      onThrowUpdate: this.onDrag,
      onThrowComplete: this.onThrowComplete,
      onDragEnd: this.onDragEnd,
      snap: (value) => {
        let val = this.offsets.filter((n) => {
          return Math.abs(n - value) < 35
        })
        if (val.length) return val[0]
      },
      allowNativeTouchScrolling: false,
      zIndexBoost: false,
      overshootTolerance: 0.5
    })
    this.dragger[0].id = 'progressbar'
    this.updateSnapPoints()
  },
  methods: {
    onThrowComplete() {
      this.isDragging = false
      this.dragger[0].update(true)
    },
    setProgress(progress) {
      let p = this.dragger[0].maxX * progress
      gsap.set('#progressbar__handle', { x: p })
    },
    onDrag() {
      this.isDragging = true
      let progress = Math.min(
        Math.max(this.dragger[0].x / this.dragger[0].maxX, 0.01),
        1
      )
      this.$emit('progress', progress)
    },
    onClickTrack(e) {
      if (e.target.id !== 'progressbar') return
      this.isDragging = true
      if (this.tween) {
        this.tween.kill()
      }
      this.tween = gsap.to(this.dragger[0], 1.2, {
        x: e.offsetX - this.handleWidth / 2,
        ease: 'easeIn',
        onUpdate: (tween) => {
          let progress = Math.min(
            Math.max(this.dragger[0].x / this.dragger[0].maxX, 0.01),
            1
          )
          this.setProgress(progress)
          this.$emit('progress', progress)
        },
        onComplete: (tween) => {
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            this.isDragging = false
          }, 500)
        }
      })
    },
    onWindowResize() {
      this.dragger[0].applyBounds()
      this.dragger[0].update()
      this.updateSnapPoints()
    },
    updateSnapPoints() {
      this.offsets = []
      let w = gsap.getProperty('#progressbar', 'width')
      this.offsets.push(-0)
      for (let i = 0; i < this.snapPoints.length; i++) {
        let p = this.snapPoints[i]
        let v = p * this.dragger[0].maxX
        this.offsets.push(v)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#progressbar {
  width: 100%;
  height: 50px;
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0) 48%,
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 255, 255, 0) 55%,
    rgba(255, 255, 255, 0) 100%
  );
  outline: none;
}

.progressbar__handle {
  width: 50px;
  height: 50px;
  background: transparent;
  background-image: url('../assets/images/ui/dragger.png');
  background-size: 50px;
}
</style>
