import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
  name: 'ukscc-banner-poc',
  render: (h) => h(App),
}).$mount('#app');
