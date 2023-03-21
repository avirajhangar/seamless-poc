import App from './App.vue';
import wrap from '@vue/web-component-wrapper';
import { VueConstructor } from 'vue';
import { seamlessCustomElement } from '@seamless/vite-plugin-vue-wc-css/seamless-custom-element';

/**
 * Wraps the vue component into a webcomponent, prepares it for the build style injection (into the shadow root) and
 * registers the component in the window.
 *
 *
 * @param {VueConstructor<App>} Vue The Vue lib that lives on the window where the component will be registered
 * @return {*} {void}
 */
export const defineCustomElements = (Vue: VueConstructor<App>): void => {
  const WrappedElement = wrap(Vue, App) as unknown as CustomElementConstructor;

  const CustomElement = seamlessCustomElement(WrappedElement);

  window.customElements.define('ukscc-my-package', CustomElement);
};

if (window.Vue) {
  defineCustomElements(window.Vue);
}
