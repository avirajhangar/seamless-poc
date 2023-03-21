<template>
  <div ref="ext" class="exterior">
    <transition name="fade" mode="out-in">
      <div
        class="exterior-vignette"
        v-show="!showLoader && this.showMessage"
      ></div>
    </transition>
    <transition name="slide-fade-up" mode="out-in">
      <div class="message-container">
        <div class="message-subContainer">
          <Message
              :title="title"
              :subtitle="subtitle"
              v-show="!showLoader && this.showMessage"
          />
          <ChevAnim class="chevAnime" v-show="!showLoader && this.showMessage "/>
        </div>
      </div>
    </transition>

    <div class="exterior__overlay"></div>
    <div
      ref="view"
      class="exterior-canvas"
      v-bind:style="{
        top: bounds.top + 'px',
        width: bounds.width + 'px',
        height: bounds.height + 'px',
        left: bounds.left + 'px'
      }"
    >
      <transition name="fade" mode="out-in">
          <Loader v-show="showLoader" ref="loader" id="loader" />
      </transition>

      <!-- Contain all images by frame with the hotspots -->
      <div class="canvas-group">
        <image-sequence
          filename=""
          folder="images/intro/"
          filetype=".jpg"
          ref="sequence"
          :totalFrames="totalFrames"
          :interactive="interactive"
          :mousewheel="mousewheel"
        ></image-sequence>
        <Hotspots
          class="hotspots"
          :class="{ disabled: isDragging }"
          ref="hotspots"
          @onHotspotClick="onHotspotClick"
          :hotspotsData="this.hotspots.exterior"
        ></Hotspots>
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <div
        v-show="!showLoader && interactive"
        class="slider-track"
        :class="{ disabled: isDragging }"
      >
        <img
          v-bind:style="{
            left: progress + '%'
          }"
          class="dot"
          src="../assets/images/ui/dragger.png"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import '@/assets/web-components/image-sequence/image-sequence.js'
import Hotspots from './Hotspots/index.vue'
import Loader from './Loader/index.vue'
import Message from './Message.vue'
import ChevAnim from '../components/icons/ChevAnim.vue'

export default {
  name: 'ukscc-exterior',
  components: {
    Hotspots,
    Loader,
    Message,
    ChevAnim
  },
  computed: {
    title() {
      return this.$appData.eqs['section-exterior'].title
    },
    subtitle() {
      return this.$appData.eqs['section-exterior'].subtitle1
    },
    showMessage() {
      return this.frame >= 0 && this.frame < 26
    },
    progress() {
      return (this.frame / this.totalFrames) * 100
    }
  },
  props: {
    interactive: {
      type: Boolean,
      default: false,
      required: true
    },
    mousewheel: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  watch: {
    frame: function (val) {
      this.$refs['sequence'].frameIndex = Math.floor(val)
      this.updateLayout()
    }
  },
  data() {
    return {
      isDragging: false,
      totalFrames: 139,
      frame: 0,
      loaded: 0,
      showLoader: true,
      hotspots: {
        exterior: this.$appData.exterior
      },
      bounds: {
        width: 1920,
        height: 1080,
        left: 0,
        top: 0
      }
    }
  },
  mounted() {
    const imageSequence = this.$refs['sequence']
    imageSequence.addEventListener('loadprogress', this.onLoadProgress)
    imageSequence.addEventListener(
      'FRAME_CHANGED',
      this.onFrameChanged.bind(this)
    )
    imageSequence.addEventListener('dragstart', this.onDragstart.bind(this))
    imageSequence.addEventListener(
      'dragcomplete',
      this.oDragcomplete.bind(this)
    )

    imageSequence.mousewheel = this.mousewheel
    imageSequence.load()
    this.onWindowResize()
    this.$refs.hotspots.show()
  },
  resieTimeout: null,
  methods: {
    setProgress(val) {
      this.$refs['sequence'].frameIndex = Math.floor(val * this.totalFrames)
    },
    setPaused(isPaused) {
      // console.log('exterior setPaused', isPaused)
    },
    onLoadProgress(e) {
      this.loaded = e.detail.progress
      this.$emit('exteriorLoadProgress', this.loaded)
      this.$refs['loader'].progress = this.loaded
      if (this.loaded == 1) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.showLoader = false
          this.$emit('exteriorLoaded')
        }, 1000)
      }
    },
    onHotspotClick(e) {
      this.$emit('hotspotclicked', e)
    },

    onDragstart(event) {
      this.isDragging = true
      this.$refs.hotspots.setEnabled(false)
    },

    oDragcomplete(event) {
      this.isDragging = false
      var items = this.hotspots.exterior
      var frame = event.detail.frame
      this.$refs.hotspots.setEnabled(true)
      this.$refs.hotspots.onFrameChanged(frame)
    },

    onFrameChanged(event) {
      var frame = event.detail.frame
      this.frame = frame
      this.$refs.hotspots.onFrameChanged(frame)
    },

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
      } else {
        this.bounds.top = 0
      }
      this.bounds.left = -Math.abs(
        (this.bounds.width - this.$refs.ext.offsetWidth) / 2
      )
    }
  },

  beforeDestroy() {
    const imageSequence = this.$refs['sequence']
    imageSequence.removeEventListener('loadprogress', this.onLoadProgress)
    imageSequence.removeEventListener(
      'FRAME_CHANGED',
      this.onFrameChanged.bind(this)
    )
    imageSequence.removeEventListener('dragstart', this.onDragstart.bind(this))
    imageSequence.removeEventListener(
      'dragcomplete',
      this.oDragcomplete.bind(this)
    )
    imageSequence.destroy()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.exterior-vignette {
  width: 100vw;
  height: 50vh;
  bottom: 0;
  position: absolute;
  pointer-events: none;
  z-index: 1;
}
.slider-track {
  pointer-events: none;
  position: fixed;
  width: 50%;
  left: 25%;
  z-index: 10;
  height: 20px;
  top: calc(100% - 90px);
  bottom: -90px;
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0) 48%,
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 255, 255, 0) 55%,
    rgba(255, 255, 255, 0) 100%
  );
  opacity: 1;
  transition: opacity 0.85s;
  &.disabled {
    opacity: 0;
  }
  .dot {
    position: absolute;
    max-width: 50px;
    transform: translate(-15px, -15px);
  }
}
.exterior {
  width: 100%;
  height: 100%;
  background: transparent;
  overflow: hidden;
  justify-content: center;
  .message-container {
    width: 100%;
  }
  .message {
    margin-bottom: 6px;
  }

  .exterior__overlay {
    position: absolute;
    display: block;
    top: 0;
    right: 0;
    width: 100%;
    height: 30vh;
    background-color: transparent;
    z-index: 3;
    margin-top: -20vh;
  }
  .exterior-canvas {
    position: absolute;
    display: flex;
    flex-flow: column;
    margin: auto;

    .canvas-group {
      position: absolute;
      width: 100%;
      height: 100%;
      .hotspots {
        z-index: 103;
      }
    }
  }
}

.loaded {
  position: relative;
  z-index: 2;
  margin: auto;
  color: #ffffff;
}

.chevAnime {
  position: relative;
  z-index: 1;
}

.message-container {
  display:flex;
  margin-top:3vh
}

.message-subContainer {
  width:auto;
  margin:0 auto
}
</style>
