<template>
  <div class="interiorTour">
    <div id="gui-container"></div>
    <div v-if="loadStage == 0" class="progressbar">
      <Loader id="loader" ref="loader" />
    </div>
    <transition name="fade" mode="out-in">
      <div v-show="isIntro" class="overlay-gradient" />
    </transition>
    <transition name="fade" mode="out-in">
      <div v-show="showOverlays" class="overlay-content">
        <Message
          v-show="showOverlays"
          class="message"
          :title="interiorMessage"
          :subtitle="subtitle"
        />
      </div>
    </transition>
    <transition name="fade" mode="out-in">
      <div class="scrollViewMessage"   v-show="showMotionInfoDesktop && !$isMobile()">
        <p>
          {{ $appData.ui['scroll-to-view'] }}
        </p>
        <img src="../assets/images/ui/mouse-scroll.png" />
      </div>
    </transition>
    <transition name="fade">
      <div
        class="ui"
        :class="{ 'ui--offsetY': !isScrollable }"
        v-show="(this.progress >= 0.15)"
      >
        <div class="ui-controls">
          <SwatchPicker
            :data="this.$appData.leathers"
            @swatchSelected="onSwatchSelected"
          />
          <ColorSlider
            ref="colorSlider"
            @onUpdate="onHueUpdate"
            @onHueOpenCloseChanged="onHueOpenCloseChanged"
          />
          <div
              v-if="$isMobile()"
              class="iconButton"
              :class="{ active: isDeviceControlled }"
          >
            <MobileIcon
                class="mobileIcon"
                :fill="isDeviceControlled ? '#00adef' : '#fff'"
                @click.native="onMobileIconClick"
            />
            <span :class={active:isMotionActive} v-html="$appData.ui['turn-on-motion']"></span>
          </div>
        </div>
      </div>
    </transition>

    <div class="threeview">
      <div class="vignette" :class="{ loading: isLoading }"></div>
      <div class="calc" v-if="$isMobile() && progress===0"></div>
      <div id="three-scene">
      </div>
      <canvas
        id="hotspotscanvas"
        class="hotspots"
        :style="{ opacity: progress < 0.15 || progress > 0.95 ? 0 : 1 }"
      ></canvas>
    </div>
  </div>
</template>

<script>
import ColorSlider from './Slider/index.vue'
import MobileIcon from './icons/MobileIcon.vue'
import SwatchPicker from './SwatchPicker/index.vue'

import Loader from './Loader/index.vue'
import InteriorTour from '../assets/js/InteriorTour.js'
import Message from '@/components/Message.vue'

export default {
  name: 'ukscc-InteriorTour',
  components: {
    Loader,
    Message,
    SwatchPicker,
    ColorSlider,
    MobileIcon
  },
  props: {
    isStatic: {
      type: Boolean
    },
    isScrollable: {
      type: Boolean,
      default: true
    }
  },
  static() {
    return {
      interiorTour: null
    }
  },
  data() {
    return {
      loadStage: 0,
      isShowingHotpots: false,
      isLoaded: false,
      isLoading: true,
      isShowingOverlay: true,
      progress: 0,
      active: false,
      isDeviceControlled: false,
      isMotionActive:true,
      showMotionInfoDesktop:false,
      motionInfoAlreadyShowed:false,
      motionActiveTimeout:null
    }
  },
  watch: {
    progress: function (val) {
      this.active = val > 0.15 && val < 0.99
      this.interiorTour.offsetAnimationScroll(this.progress)
      // par défaut desactiver la fonctionnalité 360° pour la version mobile
      if(this.progress > 0.01 && this.$isMobile() && !this.isDeviceControlled) {
        this.interiorTour.isPaused = true;
      }
      // affichage du message infobulle (360deg) desktop/mobile à l'entré dans la section intérieur
      if(this.progress >= 0.15 && !this.motionInfoAlreadyShowed ) {
        this.showMotionInfoDesktop = true
        this.isMotionActive = true
        this.motionInfoAlreadyShowed = true
      } else if(this.progress < 0.15) {
        this.showMotionInfoDesktop = false
      }
    },
    active: function (val, oldVal) {
      if (val !== oldVal) {
        this.isDeviceControlled = false
        this.$emit('onDeviceOrientation', this.isDeviceControlled)
        this.interiorTour.setPointerEvents(val)
      }

      // disparition du message infobulle (360deg) mobile/desktop au bout de 3sec
      if(val) {
        this.motionActiveTimeout = setTimeout(() => {
          this.isMotionActive = false
          this.showMotionInfoDesktop = false
        },3000)
      } else if(this.motionActiveTimeout) {
        clearTimeout(this.motionActiveTimeout)
      }
    }
  },
  computed: {
    interiorMessage() {
      return this.$appData.eqs['section-interior'].title
    },
    subtitle() {
      return this.$appData.eqs['section-interior'].subtitle1
    },
    showOverlays() {
      if (!this.isScrollable) {
        return false
      }
      return this.progress < 0.15 && this.progress > 0.01
    },
    isIntro() {
      return this.progress < 0.15
    }
  },

  mounted() {
    this.interiorTour = new InteriorTour(
      'three-scene',
      this.$appData.hotspots.filter((el) => {
        return (
          // eslint-disable-next-line no-prototype-builtins
          !el.hasOwnProperty('hyperscreen') ||
          el.hyperscreen == this.isHyperScreen
        )
      }),
      this.$appData.leathers.map((e) => {
        return { code: e.code, image: e.images[this.isHyperScreen ? 1 : 0] }
      }),
      this.isHyperScreen,
      this.isStatic,
      this.openDetailModal,
      this.onLoadProgress
    )
    if (!this.isScrollable) {
      this.active = true
    }
  },

  beforeDestroy() {
    this.interiorTour.destroy()
  },

  methods: {
    onMobileIconClick(e) {
      // activation/desactivation de la fonctionnalité 360° pour mobile
      this.isDeviceControlled = !this.isDeviceControlled
      this.interiorTour.isPaused = !this.isDeviceControlled
      this.$emit('onDeviceOrientation', this.isDeviceControlled)
      this.$emit('on360Motion', this.isDeviceControlled)
    },
    onSwatchSelected(code) {
      this.isLoading = true
      let t = this.loadTimer
      clearTimeout(t)
      t = setTimeout(() => {
        this.interiorTour.changeInterior(code, () => {
          clearTimeout(t)
          t = setTimeout(() => {
            this.isLoading = false
          })
        })
      }, 500)
    },

    onHueOpenCloseChanged(val) {
      // if (this.interiorTour) this.interiorTour.setAmbientLightsStatus(val)
      this.trackEvent({
        pageName: `modelpage.${this.$store.state.viewpoint}`,
        eventCategory: 'click',
        eventAction: 'bottom_nav',
        eventLabel: `ambient_lighting.${val ? 'open' : 'close'}`
      })
    },
    onHueUpdate(val) {
      if (val > 250 && this.interiorTour) {
        this.interiorTour.setAmbientLightsStatus(false)
      } else {
        this.interiorTour.setAmbientLightsStatus(true)
        this.interiorTour && this.interiorTour.onChangeHue(val)
      }
    },

    onStart(e) {
      this.interiorTour.onWindowResize()
      this.interiorTour.startApp(e)
      this.isShowingOverlay = false
      this.trackEvent('click', 'start tour')
      setTimeout(() => {
        this.loadStage = 2
        this.$emit('onSceneReady', true)
      }, 500)
    },
    onWindowResize() {
      this.interiorTour.onWindowResize()
    },

    onLoadProgress(progress) {
      this.$refs['loader'].progress = progress
      if (progress === 1) {
        setTimeout(() => {
          this.loadStage = 2
          this.isLoading = false
          this.$emit('onSceneReady', true)
        }, 500)
      }
    },

    onHotspotClicked(id) {
      if (this.hasListeners) {
        this.interiorTour.animateCamera(id)
      }
    },

    openDetailModal(id) {
      // this.interiorTour.isPaused = true
      this.$emit('hotspotclicked', id)
    },

    setEnabled(isEnabled) {
      this.interiorTour.isPaused = !isEnabled
      if (isEnabled) {
        this.interiorTour.deselectHotspots()
      }
    },
    offsetAnimationScroll(progress) {
      this.interiorTour.offsetAnimationScroll(progress)
    },
    setPaused(isPaused) {
      this.active = !isPaused
      this.interiorTour.isPaused = isPaused
      this.interiorTour.onWindowResize()
    }
  }
}
</script>

<style lang="scss" scoped>
#gui-container {
  background-color: #10235b;
  position: absolute;
  top: 100px !important;
  right: 20px !important;
  z-index: 10;
}

.interiorTour {
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  pointer-events: all;
}

.overlay-gradient {
  position: absolute;
  z-index: 4;
  width: 100%;
  pointer-events: none;
  height: 100%;
  width: 100%;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    //background: radial-gradient(circle, rgba(0, 0, 0, 0.4) 50%, black 150%);
  }
}

.overlay-content {
  position: absolute;
  z-index: 5;
  width: 100%;
  pointer-events: none;
  height: 100%;
  width: 100%;
  display: flex;
}

.progressbar {
  pointer-events: none;
  bottom: 83px;
  position: fixed;
  left: 37%;
  width: 23%;
  z-index: 600000000;
  margin: auto;
  background: transparent;
}

.threeview {
  position: absolute;
  z-index: 2;
  background-color: transparent;

  width: 100vw;
  height: 100%;
  display: block;

  @include desktop() {
    border-top: solid 1px rgba(255, 255, 255, 0.3);
  }
  opacity: 1;
  transition: opacity 1s;
  &.loaded {
    opacity: 1;
  }

  .calc {
    background:transparent;
    position:absolute;
    top:0;
    left:0;
    width:100vw;
    height:100vh;
    z-index:10
  }
}

#three-scene {
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: #10235b;
}
.hotspots {
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 222;
  pointer-events: none;
  background-color: transparent;
}
#hotspotscanvas {
  border: none;
  transition: opacity 0.5s;
}
.ui {
  position: absolute;
  bottom: 20px;
  &.ui--offsetY {
    bottom: 13px;
    left: 190px;
  }
  left: 0px;
  z-index: 3;
  display: flex;
  align-items: flex-end;
  width: 100%;
  margin-left: 20px;
  @include desktopDevice() {
    margin-left: 0px;
  }
  pointer-events: none;
  .ui-controls {
    display: flex;
    align-items: flex-end;
    margin-right: auto;
    margin-left: 20px;
  }
  .cta {
    margin-left: auto;
    pointer-events: all;
    .btn {
      margin-right: 40px;
      @include mobile-portrait() {
        margin-right: 20px;
      }
    }
  }
}
.iconButton {
  pointer-events: all;
  right: 20px;
  top: 10%;
  width: 38px;
  height: 38px;
  background-color: rgba(255, 255, 255, 0.15);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid 1px #ffffff;
  &.active {
    border: solid 1px #00adef;
    #mobileview360Icon {
      fill: #00adef;
    }
  }
  .mobileIcon {
    pointer-events: all;
  }
}
.vignette {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 100vh;
  width: 100%;
  z-index: 20;
  pointer-events: none;
  background: radial-gradient(
    circle,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) 66%,
    rgba(0, 0, 0, 1) 150%
  );
  @include desktopDevice() {
    background: radial-gradient(
      circle,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0) 66%,
      rgba(0, 0, 0, 1) 120%
    );
  }

  transition: all 0.5s linear;
  &::before {
    position: absolute;
    content: '';
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
    background: radial-gradient(
      circle,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 1) 66%,
      rgba(0, 0, 0, 1) 150%
    );

    z-index: -1;
    transition: opacity 0.5s linear;
  }

  &.loading {
    &::before {
      opacity: 1;
    }
  }
}


.message {
  margin: auto;
  margin-top: 37vh;
}
.iconButton {
  color:#ccc;
  text-shadow:0 -1px 0 black;
  background: rgba(78, 78, 78, 0.8);
  border: 2px solid #323232
}
//.iconButton:hover,.iconButton:focus{
//  background:rgba(255,255,255,.4);
//  box-shadow:0 1px 0 rgba(255,255,255,.4);
//}
.iconButton span{
  position:absolute;
  margin-top: -100px;
  margin-left: 6px;
  font-size:10px;
  color:#000000;
  background:#cccccc;
  padding: 7px 15px;
  box-shadow:0 0 2px rgba(0,0,0,.5);
  transition:all .5s;
  opacity:0;
}
.iconButton span:after {
  content: " ";
  position: absolute;
  bottom: -35%;
  left: 42%;
  border-top: 5px solid transparent;
  border-right: none;
  border-left: 10px solid rgba(255, 255, 255, 0.8117647059);
  border-bottom: 5px solid transparent;
  transform: translate(0%, -50%) rotate(90deg);
}

.iconButton span.active{
  opacity:1;
}
.scrollViewMessage {
  position: absolute;
  top:39vh;
  left:0px;
  z-index: 10;
  width:100vw;
  pointer-events: none;
  img {
    width: 44px
  }
  p {
    margin-bottom:0px
  }
}
</style>
