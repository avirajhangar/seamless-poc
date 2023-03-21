import { defineConfig } from 'vite';
import { plugins, resolve } from './vite.config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins,
  resolve,
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/assets/scss/_custom.scss";
          @import "@/assets/scss/_fonts.scss";
          @import "@/assets/scss/_mixins.scss";
          @import "@/assets/scss/_vue-transitions.scss";
          @import "@/assets/scss/variables/_colours.scss";
          @import "@/assets/scss/variables/_breakpoints.scss";
          @import "@/assets/scss/variables/_layout.scss";
          @import "@/assets/scss/mixins/_effects.scss";
          @import "@/assets/scss/mixins/_responsive.scss";
          @import "@/assets/scss/mixins/_units.scss";
          @import "@/assets/scss/_custom";
          @import "@/assets/scss/_fonts";
          @import "@/assets/scss/_mixins";
          @import "@/assets/scss/_vue-transitions";
          @import "@/assets/scss/variables/_colours";
          @import "@/assets/scss/variables/_breakpoints";
          @import "@/assets/scss/variables/_layout";
          @import "@/assets/scss/mixins/_effects";
          @import "@/assets/scss/mixins/_responsive";
          @import "@/assets/scss/mixins/_units";
        `
      }
    }
  }
});
