<template>
  <Section class="section section-dark">
    <div class="section-canvas">
      <div id="dark-content" class="content">
        <div class="logo anim1 anim--tl1">
          <EQSLogo id="eqs-svg" class="eqs" width="60" />
        </div>
        <h2 v-html="headline" class="anim--tl2" />
        <img
          class="star anim anim--tl3"
          width="36"
          src="@/assets/images/MB-white-lucent-star_100x100.png"
        />
      </div>
      <div id="car-image-front" class="car-image car-image--front">
        <div
          id="car-image-front-lights"
          class="car-image car-image--front-headlights"
        ></div>
      </div>
      <div id="car-image-arial" class="car-image car-image--arial"></div>
      <!-- <SoundBoard id="soundboard" /> -->
    </div>
  </Section>
</template>

<script>
import Section from '@/components/Sections/index.vue'
import EQSLogo from '@/components/icons/EQSLogo.vue'
// import SoundBoard from '@/components/Sections/SoundBoard.vue'
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
gsap.registerPlugin(MotionPathPlugin)
export default {
  name: 'ukscc-SectionDark',
  components: {
    Section,
    // SoundBoard,
    EQSLogo
  },
  timeline: null,
  mounted() {
    this.$nextTick(() => {
      this.initialiseTimeline()
    })
  },
  computed: {
    headline() {
      return this.$appData.eqs['section-dark'].title
    }
  },
  data() {
    return {
      progress: 0
    }
  },
  watch: {
    progress: function (val) {
      this.timeline.progress(val)
    }
  },

  methods: {
    stopAllSounds() {
      if (this.$store.state.isAudioPlaying) {
        this.stopAllAudio()
      }
    },
    initialiseTimeline() {
      const ww = window.innerWidth
      const wh = window.innerHeight

      this.timeline && this.timeline.kill()
      this.timeline = gsap.timeline({ paused: true })

      const setClip = () => {
        gsap.set('.soundBoard__image', {
          opacity: 0,
          scale: 1.1,
          transformOrigin: '50% 50%'
        })
        gsap.set(
          '.soundBoard__container .title, .soundBoard__container .instruction, .soundBoard__container .legal, .soundBoard__container .eqs',
          {
            opacity: 0,
            scale: 0.9,
            transformOrigin: '50% 50%'
          }
        )

        gsap.set('.soundBoard__container .soundBoard__item', {
          opacity: 0,
          scale: 1.2,
          transformOrigin: '50% 50%'
        })
        gsap.set('#car-image-front', {
          opacity: 0,
          scale: 0.4,
          transformOrigin: '50% 50%'
        })

        gsap.set('#car-image-arial', {
          x: ww * 0.5,
          y: -wh * 2,
          opacity: 1,
          transformOrigin: '50% 50%'
        })
        gsap.set('#dark-content', {
          y: 20,
          opacity: 0,
          transformOrigin: '50% 50%'
        })
      }
      setClip()
      this.timeline = gsap
        .timeline({
          paused: true
        })
        .to(
          '#car-image-front',
          {
            opacity: 1,
            scale: 1.6,
            duration: 500
          },
          '-=350'
        )
        .to('#car-image-front', {
          autoAlpha: 0,
          scale: 1.75,
          y: 10,
          duration: 500
        })
        .fromTo(
          '#car-image-front-lights',
          {
            autoAlpha: 0
          },
          {
            autoAlpha: 1,
            duration: 250
          },
          '-=650'
        )
        .to('#dark-content', { opacity: 1, scale: 1, y: 0, duration: 350 })
        .to({}, { duration: 150 })
        .to('#dark-content', { opacity: 0, scale: 0.85, duration: 350 })
        .to(
          '#car-image-arial',
          {
            duration: 4000,
            ease: 'power1.inOut',
            motionPath: {
              path: [
                { x: -ww * 2.5, y: -wh },
                { x: ww * 0.5, y: wh * 0.5 },
                { x: ww, y: wh * 2 }
              ],
              curviness: 1.5,
              align: '#path',
              autoRotate: true,
              alignOrigin: [0.5, 0.5]
            }
          },
          '-=2700'
        )
        .add(() => {
          this.stopAllSounds()
        })
        .to(
          '.soundBoard__container .title, .soundBoard__container .instruction, .soundBoard__container .legal, .soundBoard__container .eqs',
          { opacity: 1, scale: 1, duration: 150 },
          '-=800'
        )
        .to(
          '.soundBoard__image',
          {
            opacity: 1,
            scale: 1,
            duration: 250
          },
          '-=1050'
        )
        .to(
          '.soundBoard__container .soundBoard__item',
          {
            opacity: 1,
            scale: 1,
            stagger: 100
          },
          '<<'
        )

        .to({}, { duration: 3500 })

        .to(
          '.soundBoard__container .title, .soundBoard__container .instruction, .soundBoard__container .legal, .soundBoard__container .eqs',
          { autoAlpha: 0, scale: 1, duration: 150 }
        )
        .to(
          '.soundBoard__container .soundBoard__item',
          {
            autoAlpha: 0,
            scale: 1,
            stagger: 100
          },
          '<<'
        )
        .add(() => {
          this.stopAllSounds()
        })
    },
    onWindowResize() {
      this.initialiseTimeline()
    }
  },

  beforeDestroy() {
    this.timeline && this.timeline.kill()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
// .section-dark {
//   background: rgba(0, 0, 0, 1);
//   color: white;
//   position: relative;
//   overflow: hidden;
// }

.section-canvas {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  align-items: center;
  justify-content: center;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  pointer-events: none;
  align-self: center;
}
.car-image {
  z-index: 5;
  position: absolute;
  width: 90vw;
  height: 90vh;
  background-repeat: no-repeat !important;
  background-size: contain !important;
  background-position: center !important;
  &--front {
    background: url('~@/assets/images/darkness/car-front.jpg');
  }
  &--front-headlights {
    background: url('~@/assets/images/darkness/car-front-lights.jpg');
    opacity: 0;
  }
  &--arial {
    background: url('~@/assets/images/darkness/car-arial.png');
  }
}
.logo {
  display: flex;
  width: 15vw;
  max-width: 60px;
  margin: 8px;
  align-items: center;
}
.star {
  margin-top: 2vh;
}

.svg {
  overflow: visible;
  /* Fix Safari rendering bug */
  transform: translateZ(0);
  position: absolute;
  width: 100%;
  height: 100%;
}

path {
  fill: transparent;
}
</style>
