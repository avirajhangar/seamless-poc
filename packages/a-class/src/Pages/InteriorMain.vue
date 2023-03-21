<template>
  <div class="interior-wrapper">
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

    <!-- interior -->
    <section class="section">
      <div class="scene">
        <transition name="fade" mode="out-in">
          <template v-if="sceneReady">
            <div class="content">
              <ProgressBarInertia
                @progress="onProgress"
                value="0"
                :snapPoints="[]"
              />
            </div>
          </template>
        </transition>
        <Interior
          key="interior"
          ref="interior"
          @onSceneReady="onSceneReady"
          v-on:hotspotclicked="this.onHotspotClicked"
        />
      </div>
    </section>
  </div>
</template>

<script>
import Interior from '@/components/Interior.vue'
import Detail from '@/components/Detail.vue'
import ProgressBarInertia from '@/components/ProgressBarInertia.vue'
const bodyElement = document.getElementsByTagName('body')[0]
export default {
  name: 'ukscc-InteriorMain',
  components: {
    Interior,
    Detail,
    ProgressBarInertia
  },

  data() {
    return {
      isVertical: true,
      progress: 0,
      selectedHotspot: null,
      sceneReady: false,
      isVisible: false
    }
  },
  timelineScroll: null,
  scrollEvent: null,
  scrollRequest: null,

  computed: {
    selectedDetail() {
      return this.$appData.hotspots.find((x) => x.id === this.selectedHotspot)
    }
  },
  created() {
    bodyElement.classList.add('body--fillscreen')
  },
  beforeDestroy() {
    bodyElement.classList.remove('body--fillscreen')
  },
  methods: {
    onHotspotClicked(hotspotID) {
      this.selectedHotspot = hotspotID
    },
    closeModal() {
      this.$refs.interior.setEnabled(true)
      this.isVisible = false
      setTimeout(() => {
        this.selectedHotspot = null
      }, 300)
    },
    onSceneReady() {
      this.sceneReady = true
    },
    onProgressUpdate(e) {
      this.$refs.interior.progress = e.target.value
    },
    onProgress(val) {
      this.$refs.interior.progress = val
    },
    onWindowResize(e) {
      this.$refs.interior.onWindowResize()
    }
  }
}
</script>

<style lang="scss" scoped>
section {
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  width: 100vw;
  max-width: 100vw;
  overflow: hidden;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .scene {
    position: relative;
    width: 100%;
    height: 100%;
  }

  &.section--contain {
    overflow: hidden;
  }
  &.section--dark {
    color: #ffffff;
    background: #000000;
  }
}

.content {
  position: fixed;
  z-index: 101;
  bottom: 10vh;
  left: 20%;
  width: calc(100% - 40%);
}
#progress {
  width: 100%;
}
.interiorTour {
  position: relative;
}
</style>
