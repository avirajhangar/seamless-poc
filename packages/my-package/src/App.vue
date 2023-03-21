<template>
  <div id="app-vue" dir="ltr">
    <div class="tabs">
      <div class="tabs-container">
        <button
          @click="setActiveTab('rating')"
          class="tabs-container__element"
          :class="{ selected: activeTab === 'rating' }"
        >
          Rating Example
        </button>
      </div>
      <div class="tabs-container">
        <button
          @click="setActiveTab('router')"
          class="tabs-container__element"
          :class="{ selected: activeTab === 'router' }"
        >
          Router Example
        </button>
      </div>
    </div>
    <div class="card-app">
      <div class="card-app-container" v-if="activeTab === 'rating'">
        <img alt="Vue logo" src="./assets/logo.png" />
        <RatingExampleComponent @change-rating="changeRating" :rating="innerRating || 0" />
        <div>
          <div class="h-margin-bottom">
            <h3>Set property on Web Component</h3>
            <input class="card-app__range" @change="ratingChanged" :value="innerRating" type="range" min="0" max="5" />
          </div>
          <div class="h-margin-bottom">
            <label for="reset"><h3>Call method on Web Component</h3></label>
            <button class="card-app__button" id="reset" type="button" v-on:click="reset()">Reset rating</button>
          </div>
          <h5>component generated with @seamless/cli 5.0.1</h5>
        </div>
      </div>
      <div class="card-app-container" v-else-if="activeTab === 'router'">
        <SeamlessRouterExampleComponent />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import RatingExampleComponent from './components/rating-example/rating-example.vue';
import { initializeStore, SeamlessCoreStore } from '@seamless/store';
import SeamlessRouterExampleComponent from './components/seamless-router/seamless-router-example.vue';
export default Vue.extend({
  name: 'ukscc-my-package',
  components: {
    RatingExampleComponent,
    SeamlessRouterExampleComponent,
  },
  props: {
    rating: {
      type: Number,
      required: false,
      default: 3,
    },
    store: {
      default: () => initializeStore(),
    },
  },
  data() {
    return {
      innerRating: 0,
      activeTab: 'rating',
    };
  },
  mounted(): void {
    this.innerRating = this.rating;
    console.log(`App.ts -> store loaded ${this.store.version}`);
  },
  methods: {
    setActiveTab(tab: string): void {
      this.activeTab = tab;
    },
    changeRating(value: number) {
      if (!value) {
        value = 0;
      }

      this.innerRating = value;
    },

    reset() {
      this.innerRating = 0;
    },

    ratingChanged(evt: Event): void {
      const target = evt.target as HTMLInputElement;
      if (target && target.value) {
        this.changeRating(Number(target.value));
      }
    },
  },
});
</script>
<style lang="scss">
// @import './src/assets/base.scss';
#app-vue {
  height: 100vh;
  min-height: 600px;
  min-width: 320px;
  margin: 0;
  padding: 0;
  .tabs {
    width: 100%;
    display: flex;
    &-container {
      width: 100%;
      &__element {
        &:hover {
          background: #dedddd;
        }
        cursor: pointer;
        border: none;
        width: 100%;
        padding: 15px;
        &.selected {
          border-bottom: 1px solid #0075fe;
        }
      }
    }
  }
  .card-app {
    min-height: 600px;
    min-width: 320px;
    &-container {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    &__range {
      width: 100%;
    }

    &__button {
      width: 100%;
      padding: 15px;
      background-color: #0075fe;
      color: white;
      font-weight: 700;
      border: none;
    }
  }

  .h-flex-row {
    display: flex;
    flex-direction: row;
  }

  .h-flex-max {
    flex: 1;
  }

  .h-margin-bottom {
    margin-bottom: 1rem;
    flex-direction: column;
    display: flex;
    label {
      padding-bottom: 1.25rem;
    }
  }
}
</style>
