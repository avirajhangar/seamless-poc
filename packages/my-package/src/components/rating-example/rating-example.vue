<template>
  <div>
    <div class="card">
      <h1 class="card-title">Rating {{ rating }}</h1>
    </div>
  </div>
</template>
<script lang="ts">
// Vue
import Vue from 'vue';
export default Vue.extend({
  name: 'ukscc-rating-example',
  components: {
    // add here your subcomponents
  },
  props: {
    rating: {
      type: Number,
      required: false,
      default: 0,
    },
    starElements: {
      type: Array,
      default: () => [1, 2, 3, 4, 5],
    },
    icon: {
      type: String,
      default: 'favorite',
    },
  },
  methods: {
    apply(value: number) {
      this.$emit('change-rating', value);
    },
    reset() {
      this.$emit('change-rating', 0);
    },
  },
});
</script>
<style scoped lang="scss">
.container {
  display: block;
  text-align: center;
}

.card {
  &-title {
    font-size: 25px;
  }
}
</style>
