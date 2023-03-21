<template>
  <div class="exterior-wrapper">
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

    <!-- exterior -->
    <Section class="fullheight">
      <div class="scene">
        <transition name="fade" mode="out-in">
          <template v-if="sceneReady">
            <div class="content">
              <input
                type="range"
                id="progress"
                name="progress"
                min="0"
                max="1"
                step="0.01"
                value="0"
                @input="onProgressUpdate"
              />
            </div>
          </template>
        </transition>
        <Exterior
          :interactive="true"
          :mousewheel="true"
          key="exterior"
          ref="exterior"
          v-on:hotspotclicked="onHotspotClicked"
        />
      </div>
    </Section>
  </div>
</template>

<script>
import Exterior from '@/components/Exterior.vue'
import Section from '@/components/Sections/index.vue'
import Detail from '@/components/Detail.vue'

export default {
  name: 'ukscc-ExteriorMain',
  components: {
    Exterior,
    Detail,
    Section
  },

  data() {
    return {
      progress: 0,
      selectedHotspot: null,
      sceneReady: false,
      isVisible: false
    }
  },
  computed: {
    selectedDetail() {
      return this.$appData.exterior.find((x) => x.id === this.selectedHotspot)
    }
  },

  methods: {
    onHotspotClicked(hotspotID) {
      this.selectedHotspot = hotspotID
    },
    closeModal() {
      this.isVisible = false
      setTimeout(() => {
        this.selectedHotspot = null
      }, 300)
    },
    onSceneReady() {
      this.sceneReady = true
    },
    onProgressUpdate(e) {
      this.$refs['exterior'].setProgress(e)
    },
    onWindowResize(e) {
      this.$refs['exterior'].onWindowResize()
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
