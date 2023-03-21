<template>
  <div class="mainScroll" v-on:scroll="handleScroll">
    <Navigation
      :progress="progress"
      :activeSection="1"
      :isDark="false"
    ></Navigation>
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

    <Section id="section-intro" class="panel section-intro">
      <WelcomeMessage />
    </Section>

    <div class="panel panel__timeline">
      <div class="panel__timeline__scroller">
        <Section class="block section-intro">
          <Exterior :interactive="false" key="exterior" ref="exterior" />
        </Section>
        <Section class="block">
          <Interior
            key="interior"
            ref="interior"
            :isStatic="true"
            v-on:hotspotclicked="this.onHotspotClicked"
          />
        </Section>
        <Section class="block"> ds </Section>
      </div>
    </div>
    <!--
    <Section class="panel section-end">
      <h1>
        THIS IS FOR A TRULY OUTSTANDING <BR /> Automatic door opening
        ALL-ELECTRIC RANGE.
      </h1>

      <p>Scroll down.</p>
    </Section>-->
  </div>
</template>

<script>
import Section from '@/components/Sections/index.vue'
import Navigation from '@/components/Navigation/index.vue'
import Interior from '@/components/Interior.vue'
import Detail from '@/components/Detail.vue'
import Exterior from '@/components/Exterior.vue'
import WelcomeMessage from '@/components/WelcomeMessage'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default {
  name: 'ukscc-MainScroll',
  components: {
    Section,
    Exterior,
    Interior,
    Navigation,
    Detail,
    WelcomeMessage
  },

  data() {
    return {
      progress: 0.5,
      selectedHotspot: null,
      isVisible: false
    }
  },
  mounted() {
    //window.addEventListener('resize', this.onResize)

    this.$nextTick(() => {
      this.initialiseTimeline()
    })
  },
  methods: {
    handleScroll(e) {
      this.progress =
        e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight)
    },
    onHotspotClicked(hotspotID) {
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
      /*
      let sections = gsap.utils.toArray('.panel__timeline__scroller .block')
    
          trigger: '.panel__timeline',
          
            '+=' + document.querySelector('.panel__timeline__scroller').offsetWidth / 3,
          onUpdate: (self) => console.log('progress:', self.progress)

*/

      //   console.log('Scrolling')
      /* const setClip = () =>
        gsap.set('.logo path', {
          x: () => window.innerWidth / 2 - 12,
          y: () => window.innerHeight / 2 - 12,
          scale: 0,
          transformOrigin: '50% 50%'
        })

      setClip()
      ScrollTrigger.addEventListener('refresh', () => {
        setClip()
        document.documentElement.scrollTop = 0
      })
  \
  */
      const exterior = this.$refs['exterior']
      /*
      const EXTERIOR_TIMELINE = () =>
        gsap
          .timeline({
            scrollTrigger: {
              trigger: '.section--horizontal',
              pin: true,
              pinType: 'fixed',
              start: 'top +=0px',
              markers: false,
              scrub: 1,
              end: 'bottom -=50%'
            }
          })
          .fromTo(
            exterior,
            {
              frame: 0,
              ease: 'none'
            },
            {
              frame: exterior.totalFrames,
              ease: 'none'
            }
          )
*/
      let sections = gsap.utils.toArray('.panel__timeline__scroller .block')
      let maxWidth = 0

      const getMaxWidth = () => {
        maxWidth = 0
        sections.forEach((section) => {
          console.log('section.offsetWidth = ', section.offsetWidth)
          maxWidth += section.offsetWidth
        })
      }
      getMaxWidth()

      console.log('sections = ', sections, 'maxWidth', maxWidth)

      // RANGE
      const HORIZONTAL_TIMELINE = () =>
        gsap
          .timeline({
            scrollTrigger: {
              trigger: '.panel__timeline__scroller',
              pin: true,
              pinType: 'fixed',
              start: 'top top',
              markers: true,
              scrub: true,
              // Base vertical scrolling on how wide the container is so it feels more natural.
              end: () => '+=' + maxWidth,
              onUpdate: (self) => {
                console.log('progress:', self.progress)
                /*console.log('progress:', self.progress)*/
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
              frame: exterior.totalFrames,
              ease: 'none'
            }
          )

          .to(sections, {
            xPercent: -100 * (sections.length - 1),
            ease: 'none',
            duration: 15
          })
      /*
      // MASK
      const CLIPMASK_TIMELINE = () =>
        gsap
          .timeline({
            scrollTrigger: {
              scrub: 0.5,
              trigger: '.section--mask',
              endTrigger: '.section--outro',
              pin: '.section--mask .section__content',
              start: 'top top',
              end: 'bottom -=50%'
            }
          })
          .to('.logo path', {
            ease: 'Power4.easeIn',
            scale: 800,
            scrollTrigger: {
              scrub: 0.5,
              trigger: '.section--mask',
              start: 'top -10%',
              end: 'top -95%'
            }
          })
          .to('.backdrop', {
            fill: 'transparent',
            scrollTrigger: {
              scrub: 0.5,
              trigger: '.section--clipper',
              start: 'top -20%',
              end: 'top -95%'
            }
          })
*/
      gsap
        .timeline()
        //.add(EXTERIOR_TIMELINE())
        .add(HORIZONTAL_TIMELINE())
      // .add(CLIPMASK_TIMELINE())

      /*
      let sections = gsap.utils.toArray('.panel__timeline__scroller .block')
      let maxWidth = 0

      const getMaxWidth = () => {
        maxWidth = 0
        sections.forEach((section) => {
          maxWidth += section.offsetWidth
        })
      }
      getMaxWidth()
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.panel__timeline',
          pin: true,
          pinType: 'fixed',
          start: 'top +=0px',
          markers: true,
          scrub: 1,
          // Base vertical scrolling on how wide the container is so it feels more natural.
          end: () =>
            '+=' + document.querySelector('.panel__timeline__scroller').offsetWidth / 3,
          onUpdate: (self) => console.log('progress:', self.progress)
        }
      })
      const exterior = this.$refs['exterior']
      console.log('exterior', exterior, maxWidth)
      tl.fromTo(
        exterior,
        {
          frame: 0,
          ease: 'none'
        },
        {
          frame: exterior.totalFrames,
          ease: 'none'
        }
      )

      /*  
      tl.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: 'none',
        duration: 5
      })


     console.log('sectionssections',sections, sections.length)
    

      const sections = document.querySelectorAll('.block')
      const scrollContainer = document.querySelector('.panel__timeline')
      const snapBy = 1 / (sections.length - 1)
      const snap = gsap.utils.snap(snapBy)

      const scrollTween = gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: 'none'
      })

      console.log('scrollContainer')
      const horizontalScroll = ScrollTrigger.create({
        animation: scrollTween,
        trigger: scrollContainer,
        pin: true,
        scrub: 1,
        end: () => '+=' + scrollContainer.offsetWidth,
        snap: {
          duration: 0.5,
          delay: 0.0,
          ease: 'none',
          inertia: false,
          snapTo: (value, self) => {
            let snapped = snap(value)
            if (snapped > value === self.direction > 0) {
              return snapped
            }
            return snapped + (self.direction > 0 ? snapBy : -snapBy)
          }
        }
      })

      // total scroll amount divided by the total distance that the sections move gives us the ratio we can apply to the pointer movement so that it fits.
      var dragRatio =
        scrollContainer.offsetWidth /
        (window.innerWidth * (sections.length - 1))
      var drag = Draggable.create('.proxy', {
        trigger: scrollContainer,
        type: 'x',
        onPress() {
          this.startScroll = horizontalScroll.scroll()
        },
        onDrag() {
          horizontalScroll.scroll(
            this.startScroll - (this.x - this.startX) * dragRatio
          )
        }
      })[0]*/
    }
  },
  computed: {
    selectedDetail() {
      return this.$appData.hotspots.find((x) => x.id === this.selectedHotspot)
      //
    },
    isDark() {
      return this.darkRange[this.section] === 1
    }
  }
}
</script>

<style lang="scss" scoped>
.mainScroll {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 100%;
  flex: 1 0 auto;
  flex-flow: column;
  display: flex;
  overflow-y: scroll;
  color: #000000;
  background: #ffffff;
  scroll-snap-type: y proximity;

  .panel {
    scroll-snap-align: center;
  }
  .section {
    overflow: hidden;
    min-width: 100vw;
    min-height: 100vh;
  }
  .section-intro {
    background: #10235b;
    background: linear-gradient(180deg, #041038 0%, #10235b 99%);
  }
  .panel__timeline {
    scroll-snap-align: proximity;
    display: flex;
    // overflow-x: auto;
    height: 100vh;
    perspective: 440px;
    background-size: contain;
    background: linear-gradient(
      180deg,
      rgba(2, 0, 36, 1) 0%,
      rgba(17, 43, 117, 1) 13%,
      rgba(82, 156, 195, 1) 31%,
      rgba(142, 209, 225, 1) 44%,
      rgba(180, 227, 243, 1) 53%,
      rgba(251, 254, 255, 1) 62%,
      rgba(180, 227, 243, 1) 73%,
      rgba(82, 156, 195, 1) 82%,
      rgba(17, 43, 117, 1) 90%,
      rgba(2, 0, 36, 1) 99%
    );
  }

  .panel__timeline__scroller {
    overflow: scroll;
    display: flex;
    flex-direction: row;
    scroll-snap-type: x proximity;
    .section {
      scroll-snap-align: center;
    }
  }

  .interiorTour {
    position: relative;
  }
}
</style>
