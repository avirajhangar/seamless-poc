<template>
  <div id="app-vue" dir="ltr">
    <div class="aclass-hero">
      <div class="aclass-hero__content">
        <h1 class="aclass-hero__content__title">
          {{ title }}
        </h1>
        <p class="aclass-hero__content__desc">
          {{ description }}
        </p>
      </div>
      <div class="aclass-hero__image">
        <img alt="A class car" v-if="bannerimage" :src="bannerimage" />
      </div>
    </div>
    <!-- <div>
      <h1>This is to test static assets uploaded directly into aem</h1>
      <img alt="A class car 1" src="https://int-author.mbmxp.aem.oneweb.mercedes-benz.com/content/dam/united-kingdom/passengercars/cars/models/e-class-saloon/model-lines/A-Class-Digi-Exp_00.jpg" />
    </div>
    <div>
      <h1>This is to test static assets uploaded directly into our app</h1>
      <img alt="A class car 2" v-if="bannerimage1" :src="bannerimage1" />
    </div> -->
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { DialogParameters, getAemComponentData } from '../utils/dialogParameters';
import { getAemEnvironmentData } from "../utils/aemEnvironments";

export default Vue.extend({
  name: 'ukscc-banner-poc',
  components: {},
  props: {},
  data() {
    return {
      title: '',
      description: '',
      bannerimage: '',
      bannerimage1: "",
    };
  },
  mounted(): void {
    this.initialiseApp();
  },
  methods: {
    async initialiseApp() {
      try {
        const tagName = document.getElementsByTagName('ukscc-banner-poc')[0];
        const yourComponentId = tagName.getAttribute('component-id');
        const aemComponentData = await getAemComponentData(yourComponentId);
        const environmentData = await getAemEnvironmentData();
        const dialogData: DialogParameters = aemComponentData.payload as DialogParameters;
        const { title, description, bannerimage, pluginPath } = dialogData;
        console.log("pluginPath", pluginPath)
        this.title = title;
        this.description = description;
        this.bannerimage = bannerimage?.fileReference || null;
        this.bannerimage1 = environmentData?.assetUri && pluginPath ? `${environmentData?.assetUri + pluginPath + "/assets/images/A-Class-Digi-Exp_138.jpg"}` : ""
        
      } catch (e) {
        console.log(e);
      }
    },
  },
});
</script>
<style lang="scss">
#app-vue {
  .aclass-hero {
    display: flex;
    flex-direction: column;
    margin: 20px 0;
    padding: 0 20px;

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: space-between;
      margin: 30px 0;
      padding: 0 20px;
    }

    @media (min-width: 1504px) {
      max-width: 1400px;
      margin: 30px auto;
    }
  }

  .aclass-hero__content {
    width: 100%;

    @media (min-width: 768px) {
      width: calc(50% - 10px);
    }
  }

  .aclass-hero__image {
    @media (min-width: 768px) {
      width: calc(50% - 10px);
    }

    img {
      width: 100%;
    }
  }
}
</style>
