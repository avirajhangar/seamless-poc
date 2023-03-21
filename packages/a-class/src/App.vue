<template>
  <div id="app">
    <!-- <div class="grid"></div> -->
    <transition name="fade" mode="out-in">
      <OrientationMessage v-if="isPortrait && dataloaded" />
      <template v-else>
        <router-view ref="router" v-if="webGLAvailable" />
        <NoWebgl v-else />
      </template>
    </transition>

    <transition name="fade-fast" mode="out-in">
      <div v-if="showCover" class="loadCover"></div>
    </transition>
  </div>
</template>

<script>
import OrientationMessage from '@/components/OrientationMessage.vue'
import NoWebgl from './components/NoWebgl.vue'
import { WEBGL } from 'three/examples/jsm/WebGL.js'
export default {
  components: {
    NoWebgl,
    OrientationMessage
  },
  data() {
    return {
      showCover: true,
      isPortrait: true
    }
  },
  computed: {
    webGLAvailable() {
      return WEBGL.isWebGLAvailable()
    },
    dataloaded() {
      return this.$store.state.dataLoaded
    }
  },
  name: 'ukscc-App',
  created() {
    this.setViewportHeight()
    this.trackPage('landingpage')
    setTimeout(() => {
      this.showCover = false
    }, 1000)
  },

  mounted() {
    window.addEventListener('resize', this.onResize)
    const mql = window.matchMedia('(orientation: portrait)')
    this.onMatchMedia(mql)

    try {
      mql.addEventListener('change', this.onMatchMedia)
    } catch (e1) {
      mql.addListener(this.onMatchMedia)
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  resizeInterval: 0,
  methods: {
    onResize() {
      this.showCover = this.$isMobile() ? false : true
      clearTimeout(this.resizeInterval)
      this.resizeInterval = setTimeout(this.onResizeComplete, 500)
      this.setViewportHeight()
    },
    onResizeComplete() {
      this.showCover = false
    },
    setViewportHeight() {
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    },
    onMatchMedia(e) {
      if (e.matches && this.$isMobile()) {
        this.isPortrait = true
        window.scrollTo(0, 0)
      } else {
        this.isPortrait = false
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  text-align: center;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  display: flex;
  flex-direction: column;
}
.grid {
  position: fixed;
  pointer-events: none;
  z-index: 99;
  background-image: url('~@/assets/images/grid.png');
  background-size: contain;
  background-position: center;
  width: 100vw;
  height: 100vh;
  opacity: 0.5;
}
.loadCover {
  position: fixed;
  width: 100%;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  z-index: 100;
  background-color: #000000;
  top: 0;
  left: 0;
}
</style>
