<template>
  <div class="footer">
    <slot />
    <div class="labels">
      <div v-show="showDisclaimer" class="disclaimer">
        <p v-html="$appData.ui.disclaimer" />
      </div>
    </div>

    <div class="cta">
      <transition name="fade" mode="out-in">
        <div class="cta-content" v-show="showCTAs">
          <CTAButton type="shopnow" theme="light" container="bottom_nav" />
          <CTAButton type="testdrive" theme="dark" container="bottom_nav" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import CTAButton from '@/components/CTAButton/index.vue'
export default {
  name: 'ukscc-Footer',
  components: {
    CTAButton
  },
  props: {
    showCTAs: {
      type: Boolean,
      default: true
    },
    showDisclaimer: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  position: fixed;
  background: transparent;

  display: flex;
  flex-direction: row;
  align-self: start;

  color: #ffffff;
  text-align: center;
  z-index: 40;

  width: 100%;
  bottom: 0;
  transform: translate3d(0px, 0px, 0px);
  pointer-events: none;

  .labels {
    width: 50%;
    margin-left: 25%;
    align-self: flex-end;
  }
  .cta {
    min-height: 36px;
    margin: auto 10px 20px auto;
    align-self: center;
    display:flex;
    width:100vw;
    .btn {
      background-color: $mb-cta-bg;
    }
    div.cta-content{
      margin-left:auto;
      display: flex;
    }
  }
  @media (min-height: 400px) {
    .cta {
      .btn {
        font-size: 16px;
      }
    }
  }
  .footer__chev {
    transform-origin: center;
    transform: rotate(-90deg);
  }
  .disclaimer {
    p {
      font-size: 12px;
      line-height: 5px;
    }
    opacity: 0.5;
  }
}
</style>
