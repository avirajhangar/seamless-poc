<template>
  <div class="soundBoard">
    <div class="soundBoard__container">
      <div class="soundBoard__image">
        <img
          v-for="(item, index) in this.themeSounds"
          :key="`image-${index}`"
          :class="{ active: selectedTheme == index }"
          :src="require(`@/assets/images/soundboard/${item.image}`)"
          :style="{
            zIndex: selectedTheme == index ? 1 : -1,
            opacity: selectedTheme == index ? 1 : 0
          }"
        />
      </div>

      <div class="soundBoard__content">
        <img
          class="eqs"
          width="60"
          src="@/assets/images/type_badge_EQS_1C_neg.png"
        />
        <h2 class="title" v-html="title" />
        <p class="instruction" v-html="subtitle" />
        <div class="soundBoard__items">
          <div
            class="soundBoard__item"
            :class="{
              'soundBoard__item--active': selectedTheme == index && isPlaying
            }"
            v-for="(item, index) in this.themeSounds"
            :key="`sound-${index}`"
            @click="
              onSoundClick(index)
              onClick(item.title.toLowerCase().replace(/ /g, '_'))
            "
          >
            <span v-html="item.title" />
          </div>
        </div>
        <p class="legal" v-html="legal" />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ukscc-soundBoard',
  computed: {
    title() {
      return this.$appData.eqs['section-sound'].title
    },
    subtitle() {
      return this.$appData.eqs['section-sound'].subtitle1
    },
    legal() {
      return this.$appData.eqs['section-sound'].legal
    },
    isPlaying() {
      return this.$store.state.isAudioPlaying
    }
  },
  mounted() {
    this.themeSounds = this.$appData.eqs['section-sound'].themeSounds
  },
  methods: {
    onClick(selectedTheme) {
      this.trackEvent({
        pageName: `modelpage.${this.$store.state.viewpoint}`,
        eventCategory: 'click',
        eventAction: 'button',
        eventLabel: selectedTheme
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.soundBoard {
  position: absolute;
  left: 0;
  top: 0;
  min-height: 100vh;
  overflow: hidden;
  min-width: 100vw;
  pointer-events: none;
  .soundBoard__container {
    display: flex;
    flex-direction: column;
    display: flex;
    flex-direction: column;
    align-content: center;
    height: 100vh;

    .soundBoard__image {
      position: absolute;
      top: 0;
      z-index: 0;
      background-image: url('~@/assets/images/soundboard/default.jpg');
      background-repeat: no-repeat;
      background-color: transparent;
      background-position: center;
      height: 100vh;
      width: 100vw;
      display: flex;
      img {
        position: absolute;
        transition: opacity 0.75s;
        opacity: 0;
        top: 0;
        z-index: -1;
        &.active {
          transform-origin: center;
          animation: pulse 20s infinite;
        }
      }
    }
    .soundBoard__content {
      z-index: 1;
      margin: auto;
      color: $mb-color-white;
      min-width: calc(min(max(340px, 60vw), 600px));
      .instruction {
        margin-bottom: -30px;

        padding-top: 10px;
        padding-bottom: 10px;

        @include desktopDevice() {
          padding-top: 20px;
          padding-bottom: 0px;
          margin-bottom: -30px;
        }
      }
      .legal {
        position: absolute;
        font-size: 11px;
        width: 100%;
        left: 0;
        color: rgba(255, 255, 255, 0.8);
        bottom: 10px;
        pointer-events: none;
      }
      .soundBoard__items {
        display: flex;
        flex-direction: row;
        justify-content: center;
        z-index: 1;
        margin-top: 10vh;
        .soundBoard__item {
          border: solid 1px $mb-color-silver;
          padding: 15px 15px 15px 15px;
          cursor: pointer;
          color: $mb-color-silver;
          transition: all 0.3s;
          pointer-events: all;
          font-size: calc(min(max(12px, 3vw), 13px));
          padding: 10px;
          @include desktopDevice() {
            font-size: calc(min(max(12px, 3vw), 18px));
            line-height: calc(min(max(12px, 3vw), 18px));
            padding: 15px;
          }
          &:hover {
            color: $mb-color-white;
            border: solid 1px $mb-color-white;
          }
          &:active {
            color: $mb-color-noble;
            border: solid 1px $mb-color-noble;
          }
          &.soundBoard__item--active {
            border: solid 1px $mb-color-white;
            color: $mb-color-mineshaft;
            background: $mb-color-white;
          }

          &:first-child {
            margin-right: 20px;
          }
          &:last-child {
            margin-left: 20px;
          }
        }
      }
    }
  }
}
@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.5);
  }

  100% {
    transform: scale(1);
  }
}
</style>
