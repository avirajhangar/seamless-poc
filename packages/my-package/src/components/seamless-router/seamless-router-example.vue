<template>
  <div class="main">
    <sw-router-link class="reset-button button-router" clear namespace="carConfigurator" path="/"
      >Reset filter</sw-router-link
    >
    <hr />
    <p>This is just an example to show some basic router functionalities.</p>
    <div>
      <h3>Select a Bodytype</h3>
      <sw-router-link
        v-for="(type, index) in bodyTypes"
        :key="index"
        namespace="carConfigurator"
        :class="[type === selectedBodyType ? 'active' : '']"
        :path="'/' + type"
      >
        {{ type.toUpperCase() }}
      </sw-router-link>
      <transition name="fade">
        <h3 v-show="selectedSubfilter.length">Select a Model</h3>
      </transition>
      <transition name="fade">
        <div v-show="selectedSubfilter.length">
          <sw-router-link
            v-for="(type, index) in selectedSubfilter"
            :key="index"
            :class="[type === selectedModelType ? 'active' : '']"
            namespace="modelOverview"
            :path="'/' + type"
          >
            {{ type }}
          </sw-router-link>
        </div>
      </transition>
      <transition name="fade">
        <div v-show="selectedSubfilter.length">
          <sw-router-view namespace="overview" match="/:bodyType/:model">
            <div>
              <h3>BodyType: {{ selectedBodyType }}</h3>
              <h3>Model: {{ selectedModelType }}</h3>
            </div>
          </sw-router-view>
        </div>
      </transition>
      <sw-router-view namespace="errorPage" match="/404">
        <p>404 Ups somethings goes wrong</p>
      </sw-router-view>
    </div>
  </div>
</template>
<script lang="ts">
// Vue
import Vue from 'vue';
import { addUrlChangeListener, navigateTo, resolve, URLChangeEvent } from '@seamless/router';
export default Vue.extend({
  name: 'ukscc-seamless-router-example',
  components: {
    // add here your subcomponents
  },
  data() {
    return {
      vanPrefix: 'van-vito-',
      bodyTypes: ['mixto', 'panel', 'tourer'],
      selectedBodyType: '',
      selectedModelType: '',
      models: {
        panel: [
          'van-sprinter-chassis',
          'van-sprinter-chassis-crewcabine',
          'van-sprinter-chassis-option',
          'van-sprinter-chassis-option-detail',
          'van-sprinter-mixto',
          'van-sprinter-panel',
        ],
        tourer: ['van-marco-polo', 'van-marco-polo-easy-up'],
        mixto: [
          'van-toggle-build-up-1',
          'van-toggle-build-up-2',
          'van-toggle-build-up-3',
          'van-toggle-build-up-4',
          'van-toggle-build-up-5',
          'van-toggle-build-up-6',
          'van-toggle-build-up-7',
        ],
      } as { [key: string]: string[] },
      selectedSubfilter: [] as string[],
      params: {
        bodyType: '',
        model: '',
      },
    };
  },
  methods: {
    /**
     * listen to the router if the url is changed
     *
     * @param {{ from: URLData; to: URLData }} event
     * @memberof SeamlessRouterExampleComponent
     */
    carConfiguratorUrlChanged(event: URLChangeEvent): void {
      const { to } = event;
      if (to.subPathname === '/') {
        this.resetFilters();
        return;
      }
      this.selectedBodyType = to.subPathname.replace('/', '');
      this.selectedModelType = '';
      this.selectedSubfilter = this.models[this.selectedBodyType];
    },
    /**
     * listen to the router if the url is changed
     *
     * @param {{ from: URLData; to: URLData }} event
     * @memberof SeamlessRouterExampleComponent
     */
    modelOverviewUrlChanged(event: URLChangeEvent): void {
      const { to } = event;
      if (to.subPathname === '/') {
        this.resetFilters();
        return;
      }
      this.selectedModelType = to.subPathname.replace('/', '');
      const url = resolve({
        namespace: 'overview',
        path: `/${this.selectedBodyType}/${this.selectedModelType}`,
      });
      if (url) {
        navigateTo(url);
      } else {
        navigateTo(
          resolve({
            namespace: 'errorPage',
            path: `/404-error`,
          }) as URL,
        );
      }
    },
    resetFilters(): void {
      this.selectedBodyType = '';
      this.selectedModelType = '';
      this.selectedSubfilter = [];
    },
    /**
     * add url change listener
     * @memberof SeamlessRouterExampleComponent
     */
  },
  mounted(): void {
    addUrlChangeListener(this.carConfiguratorUrlChanged, { namespace: 'carConfigurator' });
    addUrlChangeListener(this.modelOverviewUrlChanged, { namespace: 'modelOverview' });
  },
});
</script>
<style scoped lang="scss">
.main {
  width: 600px;
}
.button-router {
  display: flex;
  margin-top: 15px;
  justify-content: center;
  &::part(a) {
    color: white;
  }
}

sw-router-link {
  &::part(a) {
    display: block;
    color: black;
  }
}

sw-router-view {
  &[namespace='overview'] {
    width: 200px;
    height: auto;
    margin: 0 auto;
  }
}

.fade-enter-active {
  transition: all 0.3s ease;
}

.fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-enter,
.fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
