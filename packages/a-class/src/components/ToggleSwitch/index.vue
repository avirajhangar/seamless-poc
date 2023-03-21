<template>
  <div ref="switch-slider-container" class="switch-slider-container">
    <div id="switch-slider-track">
      <div id="switch-slider-handle" class="switch-slider-handle"></div>
    </div>
    <div class="labels">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="label"
        :class="{ active: selectedIndex === index }"
        @click="onSlideToIndex(index)"
      >
        <span v-html="item" />
      </div>
    </div>
  </div>
</template>

<script>
import { TweenLite, gsap, Draggable } from 'gsap/all'
gsap.registerPlugin(Draggable)

export default {
  name: 'ukscc-ToggleSwitch',
  props: {
    items: {
      type: Array,
      required: true
    },
    defaultSelected: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      selectedIndex: 0,
      maxWidth: 0,
      itemWidth: 0
    }
  },
  mounted() {
    this.selectedIndex = this.defaultSelected
    let total = this.items.length
    this.maxWidth = this.$refs['switch-slider-container'].clientWidth
    this.itemWidth = this.maxWidth / this.items.length
    var handle = document.getElementById('switch-slider-handle')
    var draggable = new Draggable(handle, {
      throwProps: true,
      zIndexBoost: false,
      type: 'x',
      edgeResistance: 1,
      bounds: document.getElementById('switch-slider-track'),
      lockAxis: true
    })
    draggable.addEventListener('drag', onDrag)
    draggable.addEventListener('dragend', onSnap)
    function onSnap() {
      var newX =
        this.itemWidth *
        Math.round((draggable.x / (total * this.itemWidth)) * total)
      TweenLite.to(handle, 0.2, {
        x: newX,
        onComplete: () => {
          this.onDragEnd()
        }
      })
    }

    function onDrag() {
      var index = Math.round((draggable.x / (total * this.itemWidth)) * total)
      this.onSlide(index)
    }
    this.onSlideToIndex(this.selectedIndex)
  },

  methods: {
    /**
     * onSlide update
     * @event slide
     * @type {Event}
     */
    onSlide(index) {
      this.selectedIndex = index
    },
    onSlideToIndex(index) {
      var handle = document.getElementById('switch-slider-handle')
      var newX =
        index * Math.round((this.itemWidth / this.maxWidth) * this.maxWidth)
      TweenLite.to(handle, 0.2, { x: newX, onComplete: this.onDragEnd })
      this.onSlide(index)
    },
    onDragEnd() {
      this.$emit('onUpdate', this.selectedIndex)
    }
  }
}
</script>
<style lang="scss" scoped>
.switch-slider-container {
  display: flex;
  position: relative;
  background-color: #f0f0f0;
  height: 36px;
  width: 100%;
  z-index: 1;
  bottom: 0px;
  border: solid 1px #ffffff;
  background-color: transparent;

  .labels {
    position: absolute;
    width: 100%;
    height: 36px;
    display: flex;
    pointer-events: none;
    z-index: 1003;
    @media (hover: hover) {
      &:hover {
        background: rgba(255, 255, 255, 0.18);
      }
    }

    .label {
      width: 50%;
      align-self: center;
      text-align: center;
      color: #ffffff;
      font-family: daimler_csregular;
      font-size: 14px;
      transition: color 0.3s;
      pointer-events: all;
      cursor: pointer;
      line-height: 27px;
      &.active {
        color: #000000;
        pointer-events: none;
      }
    }
  }
  #switch-slider-track {
    background-size: contain;
    width: 100%;
    position: relative;
    height: 36px;
    margin: 0px;
    .switch-slider-handle {
      position: absolute;
      z-index: 2;
      width: calc(50% + 1px);
      height: 35px;

      box-shadow: 0 2px 24px 0 rgba(0, 0, 0, 0.28);
      background-image: linear-gradient(to bottom, #eeeeee 65%, #ffffff);
    }
  }
}
</style>
