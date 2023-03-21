<template>
  <div class="dragslider_wrap">
    <Chev />
    <div id="dragslider">
      <div id="progressbar" ref="progressbar">
        <div ref="progressbar__handle" class="progressbar__handle"></div>
      </div>

      <div id="dragslider__sections">
        <div
          v-for="index in sections"
          :key="`section-${index}`"
          class="dragslider__section"
        ></div>
      </div>
    </div>
    <Chev v-if="progress < 0.98" />
  </div>
</template>

<script>
import { gsap } from 'gsap'
import Draggable from 'gsap/Draggable'
import InertiaPlugin from 'gsap/InertiaPlugin'
import Chev from '@/components/icons/Chev'

gsap.registerPlugin(Draggable, InertiaPlugin)

export default {
  name: 'ukscc-DragSlider',
  components: {
    Chev
  },
  props: {
    sections: {
      type: Number,
      default: 50,
      required: true
    },
    snapPoints: {
      type: Array
    }
  },
  data() {
    return {
      progress: 0,
      sectionWidth: 0,
      offsets: [],
      isDragging: false
    }
  },
  watch: {
    progress: function (val) {
      if (!this.isDragging) {
        this.setProgress(val)
      }
    }
  },
  dragger: null,
  mounted() {
    window.addEventListener('resize', this.onResize)

    this.dragger = Draggable.create('#dragslider__sections', {
      type: 'x',
      edgeResistance: 1,
      snap: (point) => {
        // console.log('point', point)
      },
      inertia: true,

      bounds: '#dragslider',
      onDrag: this.onDrag,
      onThrowUpdate: this.onDrag,
      onThrowComplete: this.onThrowComplete,
      onDragEnd: this.onDragEnd,
      allowNativeTouchScrolling: false,
      zIndexBoost: false
    })
    this.dragger[0].id = 'dragger'
    this.onResize()
  },
  beforeDestroy() {
    if (this.dragger[0]) {
      this.dragger[0].kill()
    }
  },
  methods: {
    onThrowComplete() {
      this.dragger[0].update(true)
      this.isDragging = false
    },
    setProgress(progress) {
      this.dragger[0].update(true)
      var p = this.dragger[0].minX * progress
      this.progress = progress
      let w = this.$refs.progressbar.clientWidth
      gsap.set('#dragslider__sections', { x: p - 40 })
      gsap.set(this.$refs.progressbar__handle, { x: w * progress - 20 })
    },
    onDrag(e) {
      this.isDragging = true
      let x = this.dragger[0].x
      let minX = this.dragger[0].minX

      ///1 -2502.3838 -2266
      if (x > -0.001) {
        this.dragger[0].endDrag(e)
        gsap.set('#dragslider__sections', { x: 0 })
      } else if (x < minX) {
        this.dragger[0].endDrag(e)
        gsap.set('#dragslider__sections', { x: minX })
      }
      let progress = Math.min(
        Math.max(this.dragger[0].x / this.dragger[0].minX, 0.001),
        1
      )

      let w = this.$refs.progressbar.clientWidth
      gsap.set(this.$refs.progressbar__handle, { x: w * progress - 20 })
      this.$emit('input', progress)
    },
    onResize() {
      this.sectionWidth = window.innerWidth
    },
    onWindowResize() {
      this.sectionWidth = window.innerWidth
    }
  }
}
</script>

<style lang="scss" scoped>
.dragslider_wrap {
  display: flex;
  position: absolute;
  width: 100%;
  margin-left: 0%;
  height: 28px;
  align-items: center;
  overflow: hidden;
  .chev {
    width: 5%;
    opacity: 0.5;
    transform: scale(0.5) rotate(90deg);
    &:nth-of-type(2n) {
      transform: scale(0.5) rotate(-90deg);
    }
  }
}
#dragslider {
  background: rgba(255, 255, 255, 0.2);
  width: 90%;
  height: 100%;
  display: flex;
  overflow: auto;
  -webkit-mask-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.75) 25%,
    rgba(255, 255, 255, 0.75) 50%,
    rgba(255, 255, 255, 0.75) 75%,
    rgba(255, 255, 255, 0) 100%
  );
  mask-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0) 49%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 51%,
    rgba(255, 255, 255, 0) 100%
  );
  border: #ffffff solid 1px;

  #dragslider__sections {
    position: absolute;
    display: flex;
    height: 84%;
    background: url('~@/assets/images/ui/chevron-bg.png');
    background-repeat: repeat-x;
    background-position: center;
    .dragslider__section {
      color: rgba(255, 255, 255, 0.5);
      position: relative;
      width: 200vw;
      height: 50%;

      pointer-events: none;
      display: flex;
      flex-direction: column;
      justify-content: center;
      p {
        margin: auto;
        font-size: 1vw;
      }
    }
  }
}

#progressbar {
  position: relative;
  width: 100%;
  margin-left: 0%;
  height: 48px;
  outline: none;
  padding: 00px;
  transform-origin: center;
  transform: scale(0.8);
  bottom: 0px;
}

.progressbar__handle {
  width: 40px;
  height: 58px;
  margin-top: -15px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0) 46%,
    rgba(255, 255, 255, 0.95) 47%,
    rgb(255, 255, 255) 50%,
    rgba(255, 255, 255, 0.95) 53%,
    rgba(255, 255, 255, 0) 54%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: contain;
  border-radius: 5px;
  z-index: 3;
  outline: none;
  display: flex;
  column-gap: 10px;
  flex-direction: row;
}
#progressbar .chev-anim {
  width: 18px;
  height: 64px;
  position: absolute;
  &:nth-of-type(1n) {
    right: 0;
  }
  &:nth-of-type(2n) {
    left: 0;
  }
}
</style>
