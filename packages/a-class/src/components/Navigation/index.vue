<template>
  <div class="navigation">
    <ul class="ul-logo">
      <li @click="changeVisible">
        <img src="../../assets/images/MB-white-lucent-star_100x100.png" class="mercedes-logo" alt="">
      </li>
    </ul>
    <div class="nav">
      <ul>
        <li
            v-for="(item, index) in sections"
            :key="index"
            :class="{ active: index === activeSection - 1 }"
            @click="onClick(index + 1, item.title)"
        >
          {{ item.title }}
        </li>
      </ul>
      <div class="audio">
        <AudioIcon width="22" />
      </div>
    </div>

  </div>
</template>

<script>
import AudioIcon from '@/components/icons/Audio.vue'
import gsap from 'gsap'

export default {
  name: 'ukscc-Navigation',
  components: {
    AudioIcon
  },
  props: {
    activeSection: {
      type: Number,
      required: true,
      default: 0
    }
  },
  data() {
    return {
      visible: false
    }
  },
  watch: {
    visible: function (newValue) {
      // propriété "visible" pour afficher ou cacher la navigation
      if(newValue) {
        gsap.set('.nav', {display:'flex',  autoAlpha:0, y:-100})
        gsap.to('.nav',  {
          autoAlpha:1,
          y:0
        })
      } else {
        const timeline = gsap.timeline()
        timeline.to('.nav',  {
          autoAlpha:0,
          y:-100
        })
      }
    }
  },
  computed: {
    sections() {
      return this.$appData.sections
    }
  },
  methods: {
    onClick(index, title) {
      this.trackEvent({
        pageName: `modelpage.${this.$store.state.viewpoint}`,
        eventCategory: 'click',
        eventAction: 'topnav',
        eventLabel: title
      })
      this.$emit('onClick', index)
    },
    changeVisible() {
      this.visible = !this.visible
    }
  }
}
</script>

<style lang="scss" scoped>

.navigation {
  position: fixed;
  z-index: 103;
  top: 0;
  left: 0;
  color: #ffffff;
  pointer-events: none;
  padding: 0;
  transition: all 0.5s;
  display:flex;
  width: 100%;
  &--dark {
    color: #203c67;
  }

  .nav {
    display:none;
    background: #000000;
    width:90vw;
    ul > li {
      margin-top:auto;
      margin-bottom: auto
    }
  }

  ul {
    display: flex;
    flex-direction: row;
    padding-inline-start: 20px;
  }
  ul > li {
    display: inline;
    list-style: none;
    pointer-events: all;
    margin: 10px 10px 10px 0;
    font-size: 14px;
    opacity: 0.8;
    min-width: fit-content;
    cursor: pointer;
    @include underline(100%, -3px, $mb-color-white, 1px);

    &::before {
      transition: 0.25s linear;
      transform: scaleX(0);
    }
    &.active {
      font-family: daimler_csbold;
      opacity: 1;
      cursor: auto;
      pointer-events: none;
      &::before {
        transition: 0.25s linear;
        transform: scaleX(1);
      }
    }
  }
  .audio {
    display: flex;
    align-items: center;
    margin-left: auto;
    margin-right: 2vw;
  }
  .ul-logo {
    width: 10vw;
    background:#000000;
  }
  .mercedes-logo {
    width: 4vw
  }
  @media screen and (min-width: 992px) {
    .mercedes-logo {
      width: 2vw
    }
    ul > li {
      margin: 20px 15px 20px 0;
    }
    .ul-logo {
      width: 7vw;

    }
    .nav {
      width: 95vw
    }
  }
}
</style>
