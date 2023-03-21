<template>
  <div  class="progressbar">
    <div class="loadingbar">
      <h2>{{ $appData.ui['the-new-a-class'] }}</h2>
      <div class="loading">
        <div
            class="loading-bar"
            v-bind:style="{ transform: `scaleX(${progress})` }"
        ></div>
      </div>
      <span class="label"> {{ $appData.ui['loading'] }}  {{progressPercent}}%</span>
    </div>
  </div>

</template>

<script>
import gsap from 'gsap'

export default {
  name: 'ukscc-loadingView',
  props: ['id'],
  components: {},
  data() {
    return {
      progress: 0
    }
  },
  computed: {
    progressPercent(){
      return Math.round(this.progress*100)
    }
  },
  methods: {
    show(complete) {
      gsap.to('#' + this.id, 0.25, { opacity: 1, onComplete: complete })
    },
    hide() {
      gsap.to('#' + this.id, 0.75, { delay: 0.5, opacity: 0 })
    }
  }
}
</script>

<style lang="scss">
.progressbar {
  pointer-events: none;
  position: fixed;
  left: 0px;
  top:0px;
  width: 100vw;
  height: 100vh;
  z-index: 60;
  margin: auto;
  background: rgb(182,184,186);
  background: linear-gradient(90deg, rgba(182,184,186,1) 0%, rgba(237,238,240,1) 49%, rgba(207,211,214,1) 100%) !important;
  display:flex;
}
.loadingbar {
  align-self: center;
  text-align: center;
  width: 52%;
  font-family: daimler_csregular;
  font-size: 1rem;
  color: #000000;
  margin:auto !important;
  .label {
    display: block;
    color: rgba(0, 0, 0, 0.75);
    margin-top: 10px;
  }
  .loading {
    background-color: rgba(0, 0, 0, 0.2);
    height: 6px;
    width: 100%;
    align-self: center;
    margin: auto;
    border-radius: 6px;
    overflow: hidden;
    margin-top: 10px;
  }
  .loading-bar {
    background-color: rgba(0, 0, 0, 0.8);
    height: 100%;
    width: 100%;
    transform: scaleX(0.1);
    transform-origin: left;
    transition: all 0.3s;
  }
  h2 {
    margin-bottom:27px !important;
  }
}
h1 {
  margin: 40px 0 0;
}
</style>
