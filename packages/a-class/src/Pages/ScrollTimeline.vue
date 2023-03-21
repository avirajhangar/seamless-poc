<template>
  <div class="scroll-timeline">
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
    <!-- Navigation Bar -->
    <transition name="fade" mode="out-in">
      <Navigation
        v-if="section > 0"
        :progress="progress"
        :activeSection="section"
        @onClick="onNavigateTo"
        >{{ section }}</Navigation
      >
    </transition>

    <!-- Intro  -->
    <Section id="section-intro" class="section-intro">
      <Message
        :title="welcomeMessage"
        :subtitle="welcomeMessageSubtitle"
        :isEQ="true"
      />
      <ChevAnim :class="{ active: section === 0 }" />
    </Section>

    <!-- Pinned Timeline -->
    <div class="pinned-elements">
      <div class="progress">
        <ProgressBar :value="progress" @input="onInputProgressUpdate" />
      </div>
      <div class="interactions">
        <DragSlider
          ref="dragslider"
          :sections="5"
          @input="onProgressUpdate"
          :snapPoints="snapPoints"
        />
      </div>
      <Footer></Footer>

      <!-- Design : Exterior -->
      <Section id="section-design" class="fullheight section-pinned">
        <Exterior
          :interactive="false"
          :mousewheel="false"
          key="exterior"
          ref="exterior"
          v-on:hotspotclicked="onExteriorHotspotClicked"
          v-on:exteriorLoaded="onExteriorLoaded"
        />
      </Section>

      <!-- SectionTransition -->
      <SectionTransition
        section="interior"
        id="transition"
        ref="transition-interior"
        class="fullheight section-pinned"
      >
        <Interior
          key="interior"
          ref="interior"
          id="interior"
          :isStatic="true"
          v-on:hotspotclicked="this.onHotspotClicked"
        />
      </SectionTransition>
      <!-- Darkside -->
      <!-- <SectionTransition
        section="dark"
        id="transition-dark"
        ref="transition-dark"
        class="fullheight section-pinned"
      >
        <SectionDark
          ref="section-dark"
          class="section-dark"
          id="darkside"
          :data="$appData.eqs['section-dark']"
        />
      </SectionTransition> -->
      <!-- SectonEndframe  -->
      <section
        ref="section-endframe"
        id="section-endframe"
        class="fullheight section-pinned"
      >
        <div class="scene">
          <SectonEndframe />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

import Section from '@/components/Sections/index.vue'
// import SectionDark from '@/components/Sections/SectionDark.vue'
import SectonEndframe from '@/components/Sections/SectonEndframe.vue'
import SectionTransition from '@/components/Sections/SectionTransition.vue'
import Interior from '@/components/Interior.vue'
import Exterior from '@/components/Exterior.vue'
// import SoundBoard from '@/components/Sections/SoundBoard.vue'

import Detail from '@/components/Detail.vue'
import Navigation from '@/components/Navigation/index.vue'
import Message from '@/components/Message.vue'
import ChevAnim from '@/components/icons/ChevAnim'

import ProgressBar from '@/components/ProgressBar.vue'
import DragSlider from '@/components/DragSlider.vue'
import Footer from '@/components/Footer.vue'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const bodyElement = document.getElementsByTagName('body')[0]

export default {
  name: 'ukscc-ScrollTimeline',
  components: {
    Navigation,
    SectonEndframe,
    Section,
    Interior,
    SectionTransition,
    // SectionDark,
    Detail,
    Message,
    Exterior,
    ChevAnim,
    DragSlider,
    Footer,
    ProgressBar
  },
  props: {},
  data() {
    return {
      snapPoints: [
        0.099051, 0.171603, 0.207815, 0.232169, 0.256446, 0.388834, 0.470858,
        0.501363, 0.635491, 0.751664, 0.883127
      ],
      selectedHotspotType: null,
      section: 0,
      progress: 0,
      selectedHotspot: null,
      isVisible: false
    }
  },
  static() {
    return {
      timelineScroll: null,
      DESIGN_TIMELINE: null,
      EXTERIOR_TIMELINE: null
    }
  },

  scrollEvent: null,
  scrollRequest: null,
  mounted() {
    this.setLoading()
    this.$nextTick(() => {
      this.initialiseTimeline()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('scroll', this.scrollEvent)
  },
  computed: {
    welcomeMessage() {
      let greeting = this.$appData.eqs['section-intro'].title
      if (this.userinfo.name) {
        return `${greeting}, <span style='color: #e5007d;'>${this.userinfo.name}</span> `
      }
      return greeting
    },
    welcomeMessageSubtitle() {
      return this.$appData.eqs['section-intro'].subtitle1
    },
    selectedDetail() {
      if (this.selectedHotspotType === 0) {
        return this.$appData.exterior.find((x) => x.id === this.selectedHotspot)
      }
      return this.$appData.hotspots.find((x) => x.id === this.selectedHotspot)
    }
  },
  timeout: null,
  methods: {
    onExteriorLoaded() {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      setTimeout(() => {
        bodyElement.classList.remove('body--loading')
        clearTimeout(this.timeout)
      }, 1000)
      //
    },
    setLoading() {
      bodyElement.classList.add('body--loading')
    },
    onInputProgressUpdate(e) {
      this.onProgressUpdate(e.target.value)
    },
    onProgressUpdate(val) {
      let s = document.documentElement.scrollTop || document.body.scrollTop
      let max =
        window.scrollMaxY ||
        document.documentElement.scrollHeight -
          document.documentElement.clientHeight
      let range = max - window.innerHeight
      let scroll = window.innerHeight + val * range

      // this.DESIGN_TIMELINE.progress(e.target.value)
      window.scrollTo({ top: scroll, behavior: 'auto' })
    },
    onNavigateTo(section) {
      let progress =
        this.DESIGN_TIMELINE.labels[`${section}-1`] /
        this.DESIGN_TIMELINE.duration()
      let s = document.documentElement.scrollTop || document.body.scrollTop
      let max =
        window.scrollMaxY ||
        document.documentElement.scrollHeight -
          document.documentElement.clientHeight
      let range = max - window.innerHeight
      let scroll = window.innerHeight + progress * range

      gsap.to(window, Math.abs(this.section - section) * 2, {
        scrollTo: { y: scroll }
      })
    },
    onHotspotClicked(hotspotID) {
      this.selectedHotspot = hotspotID
    },
    onExteriorHotspotClicked(hotspotID) {
      this.selectedHotspotType = 0
      this.selectedHotspot = hotspotID
    },
    onInteriorHotspotClicked(hotspotID) {
      this.selectedHotspotType = 1
      this.selectedHotspot = hotspotID
    },
    closeModal() {
      if (this.isInterior) {
        // this.$refs.interior.setEnabled(true)
      }
      this.$refs.interior.setEnabled(true)
      this.isVisible = false
      setTimeout(() => {
        this.selectedHotspot = null
      }, 300)
    },
    initialiseTimeline() {
      this.timelineScroll && this.timelineScroll.kill()
      this.timelineScroll = gsap.timeline({ paused: true })
      const timelineScroll = this.timelineScroll

      this.$refs.interior.isPaused = true
      this.$refs.interior.setEnabled(false)

      const exterior = this.$refs['exterior']
      const transitionTimeline = this.$refs['transition-interior'] // .initialiseTimeline()
      const transitionDarkTimeline = this.$refs['transition-dark'] // .initialiseTimeline()
      gsap.set('.section-pinned', { autoAlpha: 0 })
      gsap.set('#section-design', { autoAlpha: 1 })
      /*
      this.EXTERIOR_TIMELINE = gsap
        .timeline({
          scrollTrigger: {
            trigger: '.pinned-elements',
            start: () => 'bottom bottom',
            end: () => '+=100%',
            markers: false,
            scrub: 0.2,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onLeaveBack: () => {
              this.section = 0
            },
            onUpdate: (self) => {
              this.section = parseInt(this.DESIGN_TIMELINE.previousLabel()) || 0
            }
          }
        })
        .fromTo(
          exterior,
          {
            frame: 0,
            ease: 'none'
          },
          {
            frame: 83,
            ease: 'none',
            duration: 3250
          }
        )
        .to({}, { duration: 50 })
*/
      let progress = 0
      this.DESIGN_TIMELINE = gsap
        .timeline({
          scrollTrigger: {
            trigger: '.pinned-elements',
            pin: true,
            pinType: 'fixed',
            start: 'top top',
            markers: false,
            scrub: 0.2,
            invalidateOnRefresh: true,
            end: '+=' + window.innerHeight * 10,
            onLeaveBack: () => {
              this.section = 0
            },
            onUpdate: (self) => {
              this.section = parseInt(this.DESIGN_TIMELINE.previousLabel()) || 0
              this.progress = this.DESIGN_TIMELINE.progress()
              this.$refs['dragslider'].progress = this.progress
            }
          }
        })

        .addLabel('1')
        .fromTo(
          exterior,
          {
            frame: 0,
            ease: 'none'
          },
          {
            frame: 5,
            ease: 'none',
            duration: 250
          },
          '-=100%'
        )
        .addLabel('1-1')

        .fromTo(
          exterior,
          {
            frame: 5,
            ease: 'none'
          },
          {
            frame: exterior.totalFrames,
            ease: 'none',
            duration: 3250
          }
        )
        .to({}, { duration: 350 })

        //
        .fromTo(
          '#transition',
          {
            autoAlpha: 0,
            ease: 'none'
          },
          {
            autoAlpha: 1,
            ease: 'none',
            duration: 50
          }
        )
        .fromTo(
          transitionTimeline,
          {
            progress: 0,
            ease: 'none'
          },
          {
            progress: 1,
            ease: 'none',
            duration: 3250
          }
        )
        .addLabel('2')
        .fromTo(
          '#interior',
          {
            autoAlpha: 0,
            ease: 'none'
          },
          {
            autoAlpha: 1,
            ease: 'none',
            duration: 0
          },
          '<<'
        )
        .to('#section-design', {
          autoAlpha: 0,
          ease: 'none',
          duration: 0
        })
        .to({}, { duration: 500 })
        .addLabel('2-1')
        .fromTo(
          this.$refs['interior'],
          {
            progress: 0,
            ease: 'none'
          },
          {
            progress: 1,
            ease: 'none',
            duration: 3250
          }
        )
        .addLabel('3')
        .fromTo(
          '#transition-dark',
          {
            autoAlpha: 0,
            ease: 'none'
          },
          {
            autoAlpha: 1,
            ease: 'none',
            duration: 100
          }
        )

        .fromTo(
          transitionDarkTimeline,
          {
            progress: 0,
            ease: 'none'
          },
          {
            progress: 1,
            ease: 'none',
            duration: 5000
          }
        )
        .fromTo(
          '#transition',
          {
            autoAlpha: 1
          },
          {
            autoAlpha: 0,
            duration: 0
          }
        )
        // .fromTo(
        //   this.$refs['section-dark'],
        //   {
        //     progress: 0,
        //     ease: 'Power1.easeIn'
        //   },
        //   {
        //     progress: 0.42,
        //     ease: 'Power1.easeIn',
        //     duration: 3200
        //   },
        //   '-=4200'
        // )
        // .addLabel('3-1')
        // .fromTo(
        //   this.$refs['section-dark'],
        //   {
        //     progress: 0.42,
        //     ease: 'Power1.easeIn'
        //   },
        //   {
        //     progress: 1,
        //     ease: 'Power1.easeIn',
        //     duration: 1800
        //   }
        // )
        .fromTo(
          this.$refs['section-endframe'],
          {
            autoAlpha: 0,
            ease: 'Power1.easeIn'
          },
          {
            autoAlpha: 1,
            ease: 'Power1.easeIn',
            duration: 0
          }
        )
        .fromTo(
          transitionDarkTimeline,
          {
            progress: 1,
            ease: 'Power1.easeIn'
          },
          {
            progress: 0,
            ease: 'Power1.easeIn',
            duration: 3200
          },
          '<50%'
        )
        .fromTo(
          '#transition-dark',
          {
            autoAlpha: 1,
            ease: 'none'
          },
          {
            autoAlpha: 0,
            ease: 'none',
            duration: 100
          }
        )
        .addLabel('3-1')
        .to({}, { duration: 2500 })

        .addLabel('3-2')
        .to({}, { duration: 2500 })

      // this.timelineScroll.add(this.EXTERIOR_TIMELINE)
      this.timelineScroll.add(this.DESIGN_TIMELINE)
    },

    onResize() {
      clearTimeout(this.resizeInterval)
      this.resizeInterval = setTimeout(this.onResizeComplete, 500)
    },

    onResizeComplete() {
      this.resizeChildren()
      this.initialiseTimeline()
    },
    onWindowResize() {
      this.resizeChildren()
    },
    resizeChildren() {
      this.$refs['interior'].onWindowResize()
      this.$refs['exterior'].onWindowResize()
      this.$refs['transition-dark'].onWindowResize()
      this.$refs['transition-interior'].onWindowResize()
    }
  }
}
</script>

<style lang="scss" scoped>
.pinned-elements {
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  width: 100vw;
  overflow: hidden;
  position: relative;
  section {
    position: absolute;
    top: 0;
    pointer-events: none;
  }

  .progress {
    position: fixed;
    z-index: 101;
    bottom: 10vh;
    left: 25%;
    width: 50%;
  }
}

.section--dark > .scene > img {
  position: absolute;
  transition: all 3.5s ease-in-out;
  transform: translateX(calc(100vw * 3));
  opacity: 0;
  .Section--active & {
    transform: translateX(0);
    opacity: 1;
  }
}

.section--dark.Section--active > .scene > img {
  transform: translateX(0);
  opacity: 1;
}

#section-soundboard {
  z-index: 55;
}
#section-endframe {
  z-index: 26;
}

.section-intro {
  flex-flow: column;
  .message {
    margin-top: 10px;
  }
}

.interactions {
  position: absolute;
  z-index: 10;
  border: solid 2px #00adef;
}

.interiorTour {
  position: relative;
}
</style>
