<template>
  <div id="progressbar">
    <input
      type="range"
      id="progress"
      name="progress"
      min="0"
      max="1"
      step="0.01"
      :value="value"
      @input="onInputProgressUpdate"
    />
  </div>
</template>

<script>
export default {
  name: 'ukscc-ProgressBar',
  props: {
    value: {
      required: true
    }
  },
  methods: {
    onInputProgressUpdate(e) {
      this.$emit('input', e)
    }
  }
}
</script>

<style lang="scss" scoped>
#progress {
  width: 100%;
  -webkit-appearance: none;
  width: 100%;
  height: 25px;
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0) 48%,
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 255, 255, 0) 55%,
    rgba(255, 255, 255, 0) 100%
  );
  outline: none;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}

#progress::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 50px;
  height: 50px;
  background: transparent;
  background-image: url('../assets/images/ui/dragger.png');
  background-size: 50px;
  cursor: pointer;
}

#progress::-moz-range-thumb {
  width: 50px;
  height: 50px;
  background: transparent;
  background-image: url('../assets/images/ui/dragger.png');
  background-size: 50px;
  cursor: pointer;
}
</style>
