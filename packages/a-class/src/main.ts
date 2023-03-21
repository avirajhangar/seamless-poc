import Vue from 'vue';
import App from './App.vue';
import isMobile from './plugins/browserCheck.js';
import dateMan from './plugins/dateMan.js';
import DataLayer from './helpers/DataLayer.js';
// import AudioHelper from './helpers/AudioHelper.js'
import router from './router';
import VueRouter from 'vue-router';
import store from './store/store.js';

const urlParams = new URLSearchParams(window.location.search)
//
Vue.prototype.userinfo = {
  name: urlParams.has('name') ? urlParams.get('name').toUpperCase() : '',
  csref: urlParams.has('csref') ? urlParams.get('csref') : '',
  isRetail: urlParams.has('retail') && urlParams.get('retail') === 'true',
  lang: urlParams.has('lang') ? urlParams.get('lang') : 'en',
  utm: {
    utm_source: urlParams.has('utm_source')
      ? urlParams.get('utm_source')
      : null,
    utm_medium: urlParams.has('utm_medium')
      ? urlParams.get('utm_medium')
      : null,
    utm_campaign: urlParams.has('utm_campaign')
      ? urlParams.get('utm_campaign')
      : null,
    utm_content: urlParams.has('utm_content')
      ? urlParams.get('utm_content')
      : null
  }
}

Vue.prototype.isHyperScreen =
  urlParams.has('hyperscreen') && urlParams.get('hyperscreen') === 'true'

function getURL(uri :any) {
  const { csref, utm } = Vue.prototype.userinfo
  const csrefParam = csref ? 'csref=' + csref : null
  let utm_string = ''
  Object.keys(utm).forEach((key, index) => {
    if (utm[key]) {
      utm_string += `${index > 0 && utm_string.length > 0 ? '&' : ''}${key}=${
        utm[key]
      }`
    }
  })
  if (utm_string.length > 0) {
    uri = `${uri}${uri.indexOf('?') > 0 ? '&' : '?'}${utm_string}`
  }
  if (csrefParam) {
    uri = `${uri}${uri.indexOf('?') > 0 ? '&' : '?'}${csrefParam}`
  }
  return uri
}
Vue.prototype.openURL = (url :any) => {
  window.open(getURL(url))
}

router.beforeEach((to :any, from :any, next :any) => {
  if (!Vue.prototype.$appData) {
    const interval = window.setInterval(
      function () {
        if (Vue.prototype.$appData !== undefined) {
          window.clearInterval(interval)
          store.commit('dataLoded', { loaded: true })
          next()
        }
      }.bind(this),
      100
    )
  } else {
    next()
  }
})

Vue.config.productionTip = false
Vue.use(DataLayer)
// Vue.use(AudioHelper)
Vue.use(VueRouter)
Vue.use(dateMan, { lang: Vue.prototype.userinfo.lang })
Vue.use(isMobile)
Vue.config.productionTip = false;

new Vue({
  name: 'ukscc-a-class',
  render: (h) => h(App),
}).$mount('#app');
