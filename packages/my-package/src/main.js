import Vue from 'vue';
import App from './App.vue';
import { defineRouterLink, defineRouterView, defineRouterLinkTarget } from '@seamless/router';
// Router Custom Elements
defineRouterLink();
defineRouterView();
defineRouterLinkTarget();
Vue.config.ignoredElements.push(/router-w*/);

Vue.config.productionTip = false;

new Vue({
  name: 'ukscc-my-package',
  render: (h) => h(App),
}).$mount('#app');
