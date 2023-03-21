<template>
  <div class="views" @click="onStartApp">
    <!-- Interior View -->
    <transition name="fade" mode="out-in">
      <Interior
        ref="interior"
        key="interior"
        :isScrollable="false"
        :isStatic="false"
        v-on:hotspotclicked="onHotspotClicked"
      />
    </transition>

    <!-- Exterior View -->
    <transition name="fade" mode="out-in">
      <exterior
        key="exterior"
        v-show="!isInterior"
        ref="exterior"
        v-on:hotspotclicked="onHotspotClicked"
        :interactive="true"
        :mousewheel="true"
      />
    </transition>

    <!-- Portrait  View -->
    <transition name="fade" mode="out-in">
      <OrientationMessage v-if="isPortrait" />
    </transition>

    <!-- Detail View -->
    <transition name="fade" mode="out-in">
      <template v-if="selectedHotspot">
        <Detail
          :visible="isVisible"
          :detail="selectedDetail"
          @closeModal="closeModal"
        />
      </template>
    </transition>

    <!-- Footer View -->
    <transition name="fade" mode="out-in">
      <template v-if="!isPortrait">
        <div class="footer">
          <div class="toggle">
            <ToggleSwitch
              ref="switchslider"
              class="switchslider"
              :items="['Interior', 'Exterior']"
              @onUpdate="onSwitchUpdate"
              :defaultSelected="1"
            />
          </div>

          <div class="disclaimer"><p>{{ $appData.ui['disclaimer'] }}</p></div>

          <div class="cta">
            <CTAButton type="shop" container="Footer" />
          </div>
        </div>
      </template>
    </transition>
  </div>
</template>

<script>
import CTAButton from '@/components/CTAButton/index.vue'

import ToggleSwitch from '@/components/ToggleSwitch/index.vue'
import Interior from './Interior.vue'
import Exterior from './Exterior.vue'
import Detail from './Detail.vue'
import OrientationMessage from './OrientationMessage.vue'
import screenfull from 'screenfull'

export default {
  name: 'ukscc-Main',
  components: {
    ToggleSwitch,
    Interior,
    Exterior,
    Detail,
    OrientationMessage,
    CTAButton
  },

  data() {
    return {
      isInterior: false,
      selectedHotspot: null,
      isVisible: false,
      isPortrait: true
    }
  },

  mounted() {
    this.addEventListeners()
  },
  beforeDestroy() {
    this.removeEventListeners()
  },

  computed: {
    selectedDetail() {
      if (this.isInterior) {
        return this.$appData.hotspots.find((x) => x.id === this.selectedHotspot)
      } else {
        return this.$appData.exterior.find((x) => x.id === this.selectedHotspot)
      }
    },
    findOutMoreLabel() {
      return this.userinfo.isRetail ? 'Find your EQS' : 'Call me back'
    }
  },

  methods: {
    onStartApp(e) {
      if (
        this.$isMobile() &&
        screenfull.isEnabled &&
        !screenfull.isFullscreen
      ) {
        screenfull.request()
      }
    },
    update() {
      if (this.isPortrait) {
        this.$refs['interior'].setPaused(true)
        this.$refs['exterior'].setPaused(true)
      } else {
        if (this.isInterior) {
          this.$refs['interior'].setPaused(false)
          this.$refs['interior'].progress = 0.15
          this.$refs['exterior'].setPaused(true)
        } else {
          this.$refs['interior'].setPaused(true)
          this.$refs['exterior'].setPaused(false)
        }
      }
      this.onWindowResize()
    },
    addEventListeners() {
      window.addEventListener('resize', this.onWindowResize)
      this.onWindowResize()
      /*
      const mql = window.matchMedia('(orientation: portrait)')
      mql.addListener('change', this.onMatchMedia)
      this.onMatchMedia(mql)*/
    },
    removeEventListeners() {
      window.removeEventListener('resize', this.onWindowResize)
    },

    onWindowResize() {
      if (this.$isMobile() && window.innerWidth < window.innerHeight) {
        this.isPortrait = true
      } else {
        this.isPortrait = false
      }
      window.scrollTo(0, 0)
      this.$refs['interior'].onWindowResize()
      this.$refs['exterior'].onWindowResize()
      window.scrollTo(0, this.isPortrait ? 0 : 9000)
    },

    onSwitchUpdate(index) {
      const isInterior = index === 0
      if (this.isInterior !== isInterior) {
        this.trackEvent(
          'click',
          'toggle-switch:' + (isInterior ? 'exterior' : 'interior')
        )
      }
      this.isInterior = isInterior
      this.update()
    },

    onHotspotClicked(hotspotID) {
      this.selectedHotspot = hotspotID
    },

    openDetailModal(id) {
      this.selectedHotspot = id
      this.isVisible = true
      this.interiorTour.isPaused = true
      if (this.isInterior) {
        this.$refs.interior.setEnabled(false)
      }
    },
    closeModal() {
      if (this.isInterior) {
        this.$refs.interior.setEnabled(true)
      }
      this.isVisible = false
      setTimeout(() => {
        this.selectedHotspot = null
      }, 300)
    },
    onMatchMedia(e) {
      if (e.matches && this.$isMobile()) {
        this.isPortrait = true
      } else {
        this.isPortrait = false
      }
      window.scrollTo(0, this.isPortrait ? 0 : 9000)
    }
  }
}
</script>

<style lang="scss" scoped>
.views {
  position: fixed;
  flex: 1 0 auto;
  flex-flow: column;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 100%;
  color: #000000;
  background-repeat: no-repeat;
  background: transparent;
  background-size: cover;

  .exterior {
    position: relative;
    display: flex;
    justify-content: center;
    height: 100%;
    min-height: 100%;
    background-repeat: no-repeat;
    background: transparent;
    //background: url('../assets/images/eqs-background.jpg');
    background-size: cover;
    background-position-x: center;
    background-position-y: bottom;
  }

  .interiorTour {
    min-height: 100%;
  }
}

.footer {
  display: flex;
  position: absolute;
  bottom: 4px;
  padding: 10px 40px 10px 40px;
  @include desktopDevice {
    padding: 10px 10px 10px 10px;
  }
  width: 100%;
  z-index: 1000;
  pointer-events: none;

  .toggle {
    margin-right: auto;
    .switchslider {
      pointer-events: all;
      width: 200px;
    }
  }
  .disclaimer {
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: -28px;
    p {
      margin: 0;
      opacity: 0.7;
    }
    @media screen and (max-width: 550px) {
      margin-left: 0;
      p {
        font-size: 8px;
      }
    }
  }
  .cta {
    pointer-events: all;
    margin-left: auto;
    .btn {
      min-width: 155px;
    }
  }
}
</style>
