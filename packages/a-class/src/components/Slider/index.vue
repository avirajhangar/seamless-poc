<template>
  <div
    class="color-slider-container"
    id="color-slider-container"
    :class="{ closed: !isVisible }"
    v-click-outside.stop="onClickOutside"
  >
    <div class="slider-toggle-button iconButton" @click="onToggleVisible">
      <i>
        <ColorSlider width="20" :fill="isVisible ? '#00adef' : '#ffffff'" />
      </i>
    </div>

    <!-- <div class="color-slider-track-bounds" @click="onClickTrack"></div> -->
    <div id="color-slider-track" ref="color-slider-track">
      <div
        class="color-slider-handle"
        ref="color-slider-handle"
        id="color-slider-handle"
        :style="{ background: selectedColorHex }"
      ></div>
    </div>
    
  </div>
</template>

<script>
import gsap from 'gsap'
import Draggable from 'gsap/Draggable'
import ColorSlider from '../icons/Color.vue'
import clickOutside from '@/directives/clickOutside'
gsap.registerPlugin(Draggable)
export default {
  name: 'ukscc-Slider',
  components: {
    ColorSlider
  },
  directives: {
    'click-outside': clickOutside
  },
  data() {
    return {
      selectedColor: '#00adef',
      isVisible: false,
      offset: 0,
      isinitialised: false
    }
  },

  computed: {
    containerHeight() {
      return (this.isVisible ? 260 : 38) + 'px'
    },

    selectedColorHex() {
      return this.selectedColor
    }
  },
  draggable: null,
  handle: null,
  maxDragHeight: null,
  handleHeight: null,
  beforeDestroy() {
    if (this.draggable) this.draggable.removeEventListener('drag', this.onDrag)
  },

  methods: {
    init() {
      var container = this.$refs['color-slider-track']
      this.maxDragHeight = container.offsetHeight
      this.handle = this.$refs['color-slider-handle']
      this.handleHeight = this.handle.offsetHeight
      this.draggable = new Draggable(this.handle, {
        type: 'y',
        edgeResistance: 1,
        bounds: container,
        lockAxis: true,
        inertia: false,
        onDragEnd: this.endDrag
      })

      this.draggable.addEventListener('drag', this.onDrag)
      // gsap.set(this.handle, { y: this.maxDragHeight - this.handleHeight })
      this.onDrag()
      this.endDrag()
      this.isinitialised = true
    },
    onDrag() {
      let y = gsap.getProperty(this.handle, 'y')
      var val = (y / (this.maxDragHeight - this.handleHeight)) * 35
      this.onSlide(Math.ceil(val))
    },
    onToggleVisible() {
      if (!this.isinitialised) {
        this.init()
      }
      this.isVisible = !this.isVisible
      this.$emit('onHueOpenCloseChanged', this.isVisible)
    },
    onClickTrack(e) {
      if (!this.isVisible) return

      gsap.set(this.handle, {
        y: Math.min(e.offsetY, this.maxDragHeight - this.handleHeight / 2)
      })
      this.onDrag()
      this.endDrag()
    },

    endDrag(index) {
      this.$emit('onUpdate', this.offset)
    },

    onClickOutside(e) {
      if (this.isVisible) {
        this.isVisible = false
      }
    },

    onSlide(index) {
      const max = 360
      var val = Math.floor((index / 36) * max)
      val = (val - 120) % 360
      this.offset = val
      this.selectedColor = index > 37 ? '#000000' : this.colorFromIndex(index)
    },
    byte2Hex(n) {
      var nybHexString = '0123456789ABCDEF'
      return (
        String(nybHexString.substr((n >> 4) & 0x0f, 1)) +
        nybHexString.substr(n & 0x0f, 1)
      )
    },
    RGB2Color(r, g, b) {
      return '#' + this.byte2Hex(r) + this.byte2Hex(g) + this.byte2Hex(b)
    },
    colorFromIndex(i) {
      var index = (-8 + ((36 - i) / 36) * 18) % 18
      var frequency = 0.3
      var red = Math.sin(frequency * index + 0) * 127 + 128
      var green = Math.sin(frequency * index + 2) * 127 + 128
      var blue = Math.sin(frequency * index + 4) * 127 + 128
      return this.RGB2Color(red, green, blue)
    }
  }
}
</script>
<style lang="scss" scoped>
.color-slider-container {
  width: 38px;
  background-color: rgba(78, 78, 78, 0.8);
  z-index: 1;
  display: flex;
  flex-flow: column-reverse;
  border: 2px solid #323232;
  overflow: hidden;
  //transition: height 0.6s ease-in-out 0s;
  height: 260px;
  pointer-events: all;
  margin-right:10px;
  &.closed {
    pointer-events: none;
    height: 38px;
  }
  filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.8));
  .slider-toggle-button {
    cursor: pointer;
    position: absolute;
    outline: none;
    outline-style: none;
    background-color: transparent;
    pointer-events: all;
    width: 35px;
    height: 38px;
    display:flex;
    &:focus {
      outline: none !important;
    }
    i{
      margin: 4px auto auto auto;
      transform: rotate(180deg);
    }
  }
  .color-slider-track-bounds {
    height: 200px;
    position: absolute;
    bottom: 46px;
    width: 100%;
  }
  #color-slider-track {
    pointer-events: none;
    // 0	8.1	14.4	22.5	32.4	43.2	52.2	61.2	70.2	77.4	90
    background-image: linear-gradient(
      to bottom,
      var(--lightish-purple),
      var(--heliotrope) 8%,
      var(--rosy-pink) 14%,
      var(--orangish) 22%,
      var(--pale-orange) 32%,
      var(--sandy-yellow) 43%,
      var(--light-yellowish-green) 52%,
      var(--light-bluish-green) 61%,
      var(--tiffany-blue) 70%,
      var(--sky) 74%,
      var(--cornflower) 90%,
      #000000 91%
    );
    background-size: contain;
    width: 4px;
    border-radius: 10px;
    position: absolute;
    height: 200px;
    margin: 16px;
    bottom: 30px;

    .color-slider-handle {
      position: relative;
      border-radius: 50%;
      height: 26px;
      width: 26px;
      left: -12px;
      top: -12px;
      background: #ffffff;
      border: solid 2px #ffffff;
      pointer-events: all;
    }
  }
}
</style>
