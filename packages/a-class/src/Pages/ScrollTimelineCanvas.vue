<template>
  <div class="scroll-timeline">
    <!-- Detail View -->
    <transition name="fade" mode="out-in">
      <template v-if="selectedHotspot">
        <Detail
          :viewpoint="viewpoint"
          :visible="isVisible"
          :detail="selectedDetail"
          @closeModal="closeModal"
        />
      </template>
    </transition>
    <!-- Navigation Bar -->
    <transition name="fade" mode="out-in">
      <Navigation
        v-show="!showLoader"
        ref="navigation"
        :activeSection="section"
        @onClick="onNavigateTo"
        >{{ section }}</Navigation
      >
    </transition>
    <transition v-if="showLoader" name="fade" mode="out-in">
        <Loader ref="loader" id="loader" />
    </transition>
    <!-- Intro  -->
    <Section id="section-intro" class="section-intro">
      <div class="intro-container">
        <Message
            :title="welcomeMessage"
            :subtitle="welcomeMessageSubtitle"
            :isEQ="true"
        />
        <ChevAnim
            :class="{ active: section === 0 && !showLoader }"
            @click.native="onScrollToStart"
        />
      </div>
    </Section>

    <div class="separator"></div>

    <!-- Pinned Timeline -->
    <div class="pinned-elements">
      <div class="overlay loading-overlay"></div>
      <!-- Design : Exterior -->
      <Section id="section-design" class="fullheight section-pinned">
        <Exterior
          :interactive="false"
          :mousewheel="false"
          key="exterior"
          ref="exterior"
          v-on:hotspotclicked="onExteriorHotspotClicked"
          v-on:exteriorLoaded="onExteriorLoaded"
          v-on:exteriorLoadProgress="onExteriorLoadProgress"
        />
      </Section>


      <Section id="section-interior" class="fullheight section-pinned">
        <Interior
          key="interior"
          ref="interior"
          id="interior"
          :isStatic="true"
          v-on:onDeviceOrientation="this.onDeviceOrientation"
          v-on:hotspotclicked="this.onInteriorHotspotClicked"
          v-on:on360Motion="this.on360Motion"
        />
      </Section>


      <!-- Endframe  -->
      <section
        ref="section-endframe"
        id="section-endframe"
        class="fullheight section-pinned"
      >
        <div class="scene">
          <CarConfigurator ref="carConfigurator" />
        </div>
      </section>
    </div>
    <Footer :showCTAs="true" :showDisclaimer="false" />
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

import Loader from '@/components/Loader/index.vue'
import Section from '@/components/Sections/index.vue'
// import SectionDark from '@/components/Sections/SectionDark.vue'
import CarConfigurator from '@/components/CarConfigurator.vue'
import Interior from '@/components/Interior.vue'
import Exterior from '@/components/Exterior.vue'
// import SoundBoard from '@/components/Sections/SoundBoard.vue'

import Detail from '@/components/Detail.vue'
import Navigation from '@/components/Navigation/index.vue'
import Message from '@/components/Message.vue'
import ChevAnim from '@/components/icons/ChevAnim.vue'

// import DragSlider from '@/components/DragSlider.vue'

// import TransitionVid from '@/ComponentTests/transition-video.vue'
import Footer from '@/components/Footer.vue'
import isMobile from "ismobilejs";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const bodyElement = document.getElementsByTagName('body')[0]

export default {
  name: 'ukscc-ScrollTimelineCanvas',
  components: {
    Navigation,
    Section,
    Interior,
    Detail,
    Message,
    Exterior,
    ChevAnim,
    Footer,
    Loader,
    CarConfigurator
  },
  props: {},
  data() {
    return {
      snapPoints: [0.730854, 0.82735, 0.93147],
      selectedHotspotType: null,
      section: 0,
      progress: 0,
      selectedHotspot: null,
      isVisible: false,
      showLoader: true,
      didInteract: false,
      isDeviceControlled: false,
      is360MotionActive: false
    }
  },
  static() {
    return {
      timelineScroll: null,
      DESIGN_TIMELINE: null,
      navTimeline: null
    }
  },
  scrollEvent: null,
  scrollRequest: null,
  mounted() {
    this.setLoading()
    window.addEventListener('resize', this.onResize)
    this.$nextTick(() => {
      this.initialiseTimeline()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  watch: {
    section: function (val, old) {
      if (old != val) {
        this.$store.commit('viewpoint', `${this.viewpoint}`)
      }
      if (old == 0 && val > 0) {
        this.trackReachedScrollbar()
      }
    }
  },
  computed: {
    showDragSlider() {
      return this.isDeviceControlled && this.section === 2 ? false : true
    },
    viewpoint() {
      console.log("this.section", this.section)
      return this.section == 0
        ? 'intro'
        : `${this.$appData.sections[this.section - 1].title.toLowerCase()}`
    },
    welcomeMessage() {
      let greeting = this.$appData.eqs['section-intro'].title
      if (this.userinfo.name) {
        return `${greeting}, <span style='color: #e5007d;'>${this.userinfo.name}.</span>`
      }
      return `${greeting}.`
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
    on360Motion(is360MotionActive) {
      if(this.$isMobile()) {
        this.is360MotionActive = is360MotionActive
      }
    },
    onDeviceOrientation(isDeviceControlled) {
      this.isDeviceControlled = isDeviceControlled
    },
    onScrollToStart() {
      window.scrollTo({ top: window.innerHeight + 24, behavior: 'smooth' })
    },
    trackReachedScrollbar() {
      this.trackEvent({
        pageName: 'landingpage',
        viewpoint: this.viewpoint,
        eventCategory: 'click',
        eventAction: 'slider',
        eventLabel: 'slider'
      })
    },
    onExteriorLoadProgress(val) {
      this.$refs['loader'].progress = val
    },
    onExteriorLoaded() {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      setTimeout(() => {
        bodyElement.classList.remove('body--loading')
        this.showLoader = false
        clearTimeout(this.timeout)
      }, 1200)
    },
    setLoading() {
      bodyElement.classList.add('body--loading')
      this.showLoader = true
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

      this.didInteract = true
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
      let scroll = window.innerHeight + progress * range +10
      // fermer le navbar
      this.$refs['navigation'].visible = false
      gsap.fromTo(
        '.loading-overlay',
        {
          autoAlpha: 0,
          ease: 'none'
        },
        {
          autoAlpha: 1,
          ease: 'none',
          duration: 0.3,
          onComplete: () => {
            window.scrollTo(0, scroll)
            this.updateProgress()
            gsap.fromTo(
              '.loading-overlay',
              {
                autoAlpha: 1,
                ease: 'none'
              },
              {
                autoAlpha: 0,
                ease: 'none',
                duration: 0.3,
                delay: 0.3,
                onComplete: () => {
                  this.updateProgress()
                }
              }
            )
          }
        }
      )
    },

    updateProgress() {
      this.section = parseInt(this.DESIGN_TIMELINE.previousLabel()) || 0
      this.progress = this.DESIGN_TIMELINE.progress()
    },
    onExteriorHotspotClicked(hotspotID) {
      console.log("onExteriorHotspotClicked ", hotspotID);
    },
    onInteriorHotspotClicked(hotspotID) {
      this.selectedHotspotType = 1
      this.selectedHotspot = hotspotID
    },
    closeModal() {
      if(!isMobile().any) {
        this.$refs.interior.setEnabled(true)
      }

      this.isVisible = false
      setTimeout(() => {
        this.selectedHotspot = null
      }, 300)
    },
    goTo(progress) {
      let max =
          window.scrollMaxY ||
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight
      let range = max - window.innerHeight
      let scroll = window.innerHeight + progress * range +10
      window.scrollTo(0, scroll)
      this.updateProgress()
    },
    initialiseTimeline() {
      this.DESIGN_TIMELINE && this.DESIGN_TIMELINE.kill()
      this.DESIGN_TIMELINE = gsap.timeline({ paused: true })
      this.INTRO_TIMELINE && this.INTRO_TIMELINE.kill()
      this.INTRO_TIMELINE = gsap.timeline({ paused: true })

      this.timelineScroll && this.timelineScroll.kill()
      this.timelineScroll = gsap.timeline({ paused: true })

      const exterior = this.$refs['exterior']
      const transitionTimeline = this.$refs['transition-interior']

      gsap.set('.section-pinned', { autoAlpha: 0 })
      gsap.set('#section-design', { autoAlpha: 1 })
      gsap.set('.loading-overlay', { autoAlpha: 0 })

      this.INTRO_TIMELINE = gsap
        .timeline({
          scrollTrigger: {
            trigger: '.section-intro',
            pin: false,
            pinType: 'fixed',
            start: 'top top',
            markers: false,
            scrub: 0.2,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            end: '+=' + window.innerHeight * 1,
            onLeaveBack: () => {
              this.section = 0
            },
          }
        })

        .to(
          {},
          {
            duration: 2000
          }
        )
        .fromTo(
          exterior,
          {
            frame: 0,
            ease: 'none'
          },
          {
            frame: 16,
            ease: 'none',
            duration: 250
          }
        )
          // transition page d'accueil vers section exterieur
          .fromTo('.pinned-elements', {
            opacity:0,
            duration: 5000
          }, {
            opacity:1,
            duration: 5000,
          }, 's')
          .to('.section-intro', {
            opacity: 0,
            duration: 5000,
            onUpdate: (self) => {
              // si la barre de navigation est visible, on le cache à l'entré de la section exterieur
              if(this.$refs['navigation'] !== undefined && this.INTRO_TIMELINE.progress()>0.795756) {
                this.$refs['navigation'].visible = false
              }
            }
          },'s')
      let isAlreadyScrolled = false
      // début de passage sur les 3 sections
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
            anticipatePin: 1,
            end: '+=' + window.innerHeight * 15,
            onLeaveBack: () => {
              this.section = 0
            },
            onUpdate: (self) => {
              this.section = parseInt(this.DESIGN_TIMELINE.previousLabel()) || 0
              this.progress = this.DESIGN_TIMELINE.progress()
              // passage sur la section intérieur (version mobile)
              if(this.$refs['interior'] !== undefined) {
                if(this.$refs['interior'].progress < 0.4) {
                  isAlreadyScrolled = false
                }
                // si la fonctionnalité 360°motion de la section est désactivé, on raccourci le scroll
                // et on passe direct à la section car configurator
                if(this.$refs['interior'].progress > 0.4 &&
                    this.$refs['interior'].progress <1 &&
                    this.$isMobile() &&
                    !this.is360MotionActive &&
                    self.direction===1
                ) {
                  if(!isAlreadyScrolled) {
                    isAlreadyScrolled = true;
                    let progress =
                        this.DESIGN_TIMELINE.labels[`2-3`] /
                        this.DESIGN_TIMELINE.duration()
                    this.goTo(progress)
                  }
                }
                else if(this.$refs['interior'].progress > 0.4 &&
                    this.$refs['interior'].progress <0.8 &&
                    this.$isMobile() &&
                    !this.is360MotionActive &&
                    self.direction===-1
                ){
                  this.goTo(0.403219)
                }
              }


            }
          }
        })
        .addLabel('1')
        .to({}, { duration: 350 })
        .addLabel('1-1')
          // démarrage séquence d'image section exterieur
        .fromTo(
          exterior,
          {
            frame: 16,
            ease: 'none',
          },
          {
            frame: exterior.totalFrames,
            ease: 'none',
            duration: 6000,
          }
        )

        .to({}, { duration: 350 })
          // transition section exterieur vers interieur
        .fromTo(
          '#section-interior',
          {
            ease: 'none',
            y: '100vh',
            duration: 5000
          },
          {
            ease: 'none',
            duration: 500,
            y: 0,
          },
          '-=750'
        )
        .fromTo(
          '#section-interior',
          {
            autoAlpha: 0,
          },
          {
            autoAlpha: 1,
            duration: 0
          },
          '-=1000'
      )
        
        .addLabel('2')
        .fromTo(
          '#section-design',
          {
            autoAlpha: 1,
            ease: 'none'
          },
          {
            autoAlpha: 0,
            ease: 'none',
            duration: 500
          },
          '>>'
        )
        .addLabel('2-1', '+=150')
          // update progress lors du scroll de la section interieur
        .fromTo(
          this.$refs['interior'],
          {
            progress: 0,
            ease: 'none'
          },
          {
            progress: 1,
            ease: 'none',
            duration: 10000
          }
        )
          .addLabel('2-3')

          // transition section interieur vers car configurator
        .fromTo(
          '#interior',
          {
            autoAlpha: 1
          },
          {
            autoAlpha: 0,
            duration: 1800
          },
            'sc'
        )
        
        .fromTo(
          this.$refs['section-endframe'],
          {
            autoAlpha: 0,
            ease: 'Power1.easeIn',
            y: '100vh',
          },
          {
            autoAlpha: 1,
            ease: 'Power1.easeIn',
            duration: 1800,
            y: 0,
          },
          'sc' // Comment
        )
        .addLabel('3-1')
          // update progress lors du scroll de la section carConfigurator
        .fromTo(
            this.$refs['carConfigurator'],
            {
              progress: 0,
              ease: 'none'
            },
            {
              progress: 1,
              ease: 'none',
              duration: 1800
            }
        )
        .addLabel('3-2')
      this.DESIGN_TIMELINE.duration()
      this.timelineScroll.add(this.DESIGN_TIMELINE)
    },

    onResize() {
      clearTimeout(this.resizeInterval)
      this.resizeInterval = setTimeout(this.onResizeComplete, 500)
    },

    onResizeComplete() {
      this.resizeChildren()
      //this.initialiseTimeline()
    },
    onWindowResize() {
      this.resizeChildren()
    },
    resizeChildren() {
      if(this.$refs['interior'] !== undefined) this.$refs['interior'].onWindowResize()
      if(this.$refs['exterior'] !== undefined) this.$refs['exterior'].onWindowResize()
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-timeline {
  height: 200vh;
}
.pinned-elements {
  height: 100vh;
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
    bottom: 20vh;
    left: 20%;
    width: calc(100% - 40%);
  }
  #progress {
    width: 100%;
  }
}
#section-interior {
  z-index: 4;
}
#section-design {
  z-index: 5;
}
#section-dark {
  z-index: 6;
  background-color: black;
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
  justify-content: normal !important;
  background-image: url("/images/section-intro/section_intro-min.jpg");
  background-size: 160vw;
  background-repeat: no-repeat;
  background-position: 50% 47%;
  .message {
    margin-top: 10px;
    margin-bottom:5px
  }
  .chev-anim {
    pointer-events: all;
    cursor: pointer;
  }
  .intro-container {
    //background:red;
    margin-top: 18vh;
    margin-left: 14vw;
  }

}

.interiorTour {
  position: relative;
}


.interactions {
  position: absolute;
  z-index: 27;
  padding: 0px;
  width: 50vw;
  height: 48px;
  left: 25vw;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  @include desktopDevice() {
    bottom: 0px;
  }
  @media (min-height: 400px) {
    bottom: 20px;
  }
  //.chev-anim {
    //width: 18px;
    //height: 64px;
    //&:nth-of-type(1) {
    //  transform-origin: top left;
    //  transform: rotate(90deg) translateX(0px);
    //  margin-right: auto;
    //  position: absolute;
    //  left: 21px;
    //}
    //&:nth-of-type(2) {
    //  transform-origin: top right;
    //  transform: rotate(-90deg) translateX(0px);
    //  margin-left: auto;
    //  position: absolute;
    //  right: 21px;
    //}
  //}
}
.loading-overlay {
  opacity: 0;
  pointer-events: none;
  z-index: 333;
}

.separator {
  width: 100vw;
  height: 24px;
  background: #212121;
}

</style>
