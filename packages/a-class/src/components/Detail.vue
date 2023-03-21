<template>
  <div class="detail-view" :class="alignLeft" @click="closeModal">
    <img
      :src="require(`@/assets/images/detail/${detail.images[0]}`)"
      alt=""
      ref="bg-image"
      style="display: none"
    />
    <transition name="fade" mode="out-in">
      <div
        v-show="isLoaded"
        class="wrapper"
        :style="{
          backgroundImage:
            'url(' + require(`@/assets/images/detail/${detail.images[0]}`) + ')'
        }">

        <transition :name="slideInDirection" mode="in-out">
          <div v-if="isVisible" class="article">
            <div v-if="hasCloseButton" class="close-button">
              <a @click.stop="closeModal" class="close"></a>
            </div>

            <div class="content">
              <h3 v-html="detail.headline"></h3>
              <p class="description" v-html="detail.description"></p>

              <p v-if="detail.legal" class="legal" v-html="detail.legal"></p>
            </div>
            <div class="cta">
            <!--<CTAButton type="testdrive" :container="eventContainer" />-->
              <button class="btn btnTransparent">
                {{ $appData.eqs['discover-more'] }}
              </button>
            </div>

          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'ukscc-DetailView',
  props: {
    detail: Object,
    viewpoint: String,
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    eventContainer() {
      return 'detail:' + this.detail.title
    },
    alignLeft() {
      return { 'detail-view-left': this.detail.alignment === 0 }
    },
    slideInDirection() {
      return this.detail.alignment === 0
        ? 'slide-fade-left'
        : 'slide-fade-right'
    },
    hasCloseButton() {
      return this.$listeners && this.$listeners.closeModal
    }
  },
  data() {
    return {
      isVisible: false,
      isLoaded: false
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.isVisible = val
      },
      deep: true
    }
  },
  mounted() {
    let image = this.$refs['bg-image']
    image.onload = () => {
      this.isLoaded = true
    }
    setTimeout(() => {
      this.isVisible = true
    }, 600)
  },
  methods: {
    closeModal(e) {
      e.preventDefault()
      this.isVisible = false
      let infospotText = this.detail.title.toLowerCase().replace(/ /g, '_')
      this.trackEvent({
        pageName: `modelpage.${this.viewpoint}`,
        infospot: infospotText,
        viewpoint: this.viewpoint,
        eventCategory: 'click',
        eventAction: 'button',
        eventLabel: 'close'
      })
      setTimeout(() => {
        this.$emit('closeModal')
      }, 400)
    }
  },
  created: function () {
    let infospotText = this.detail.title.toLowerCase().replace(/ /g, '_')
    this.trackEvent({
      pageName: `modelpage.${this.viewpoint}`,
      infospot: infospotText,
      viewpoint: this.viewpoint,
      eventCategory: 'click',
      eventAction: 'infospot',
      eventLabel: infospotText
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$opacity: 0.6;
.detail-view {
  z-index: 2000;
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  background-color: rgba(0, 0, 0, 1);
  top: 0;
  left: 0;
  overflow: hidden;
  align-items: center;
}

.detail-view .wrapper {
  display: flex;
  flex-direction: row;
  z-index: 1;
  width: 100%;
  height: 100%;
  pointer-events: none;
  position: relative;
  background-color: rgba(0, 0, 0, 1);
  background-size: cover;
  background-position: center;

  .article {
    position: absolute;
    display: flex;
    flex-flow: column;
    text-align: center;
    align-items: center;
    right: 0;
    width: 50%;
    margin-left: auto;
    height: 100%;
    min-height: 100%;
    color: #000000;
    background: rgba(255,255,255,0.8117647059);
    padding: 30px 0px 15px 0px;
    justify-content: center;
    z-index: 2;
    top: 0;

    .logo {
      width: 50px;
      margin: 0 auto;
    }

    .content {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;

      padding: 0px 10px 0px 10px;
      @include mobile() {
        padding: 0px 30px 0px 30px;
      }
      pointer-events: all;
      align-self: center;
      margin-top: 20px;
      margin-bottom: 0;
      overflow-y: scroll;
      max-width: 700px;

      h3 {
        //text-transform: uppercase;
        line-height: 1.9rem;
        font-size: 2rem;
        margin: 0 0 5vh 0;

        @include mobile-small-landscape() {
          line-height: 1.2rem;
          font-size: 1.4rem;
        }

        .br::before {
          content: unset;
          white-space: unset;
          content: '\A';
          white-space: pre;
        }
      }
      p.description {
        margin-bottom: 0;
        font-size: 0.85rem;
        max-width: 90%;
        align-self: center;
        @include desktopDevice() {
          font-size: 1.05rem;
          line-height: 1.5rem;
          max-width: 80%;
          margin-bottom: 20px;
        }
      }

      p.legal {
        margin-bottom: 0;
        font-size: 10px;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
  .cta {
    display: flex;
    justify-content: center;
    padding: 10px 0;
    margin-top: 3vh
  }

  .mb-logo {
    margin-top: 10px;
    img {
      width: 36px;
    }
  }
}

.close-button {
  position: absolute;
  top: 3vh;
  right: 2vw;
  width: 30px;
  height: 30px;
  border-left: solid 1px rgba(255, 255, 255, 0.1);
  @include desktopDevice {
    top: 2vh;
    right: 2vw;
    left: unset;
    margin-left: initial;
    margin-right: initial;
    width: 46px;
    height: 46px;
    pointer-events: all;
    cursor: pointer;
    background-color: transparent;
  }
}
.close {
  position: absolute;
  width: 24px;
  height: 24px;
  opacity: 1;
  top: 6px;
  left: -2px;
  @include desktopDevice {
    width: 34px;
    height: 34px;
    left: 6px;
  }
}
.close:hover {
  opacity: 0.8;
}
.close:before,
.close:after {
  position: absolute;
  left: 15px;
  content: ' ';
  height: 16px;
  width: 2px;
  background-color: #000000;
  @include desktopDevice {
    height: 24px;
    left: 17px;
    top: 4px;
  }
}
.close:before {
  transform: rotate(45deg);
}
.close:after {
  transform: rotate(-45deg);
}

.detail-view-left {
  .disclaimer {
    left: 50% !important;
  }
  .article {
    right: auto !important;
  }
  .close-button {
    right: 0;
    margin-right: -30px;
    margin-left: initial;
    @include desktopDevice {
      margin-left: initial;
      margin-right: initial;
    }
  }
}
</style>
