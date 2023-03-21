import Vue from 'vue'
import VueRouter from 'vue-router'

// Section Component routes
import InteriorMain from './Pages/InteriorMain.vue'
import Data from './Pages/Data.vue'
import ExteriorMain from './Pages/ExteriorMain.vue'
import Main from './components/Main.vue'
import NoWebgl from './components/NoWebgl.vue'
import { WEBGL } from 'three/examples/jsm/WebGL.js'
import ScrollTimelineCanvas from './Pages/ScrollTimelineCanvas.vue'

const routes = [
  {
    path: '/',
    name: 'ScrollTimelineCanvas',
    component: ScrollTimelineCanvas
  },
  { path: '/main', name: 'main', component: Main },
  { path: '/exterior', name: 'exteriormain', component: ExteriorMain },
  { path: '/detail', name: 'detail', component: Data },
  {
    path: '/interior',
    props: { isStatic: true },
    name: 'Interior',
    get component() {
      if (WEBGL.isWebGLAvailable()) {
        return InteriorMain
      } else {
        return NoWebgl
      }
    }
  }
]

export default new VueRouter({
  mode: 'history',
  routes: routes,
  base: '/',
  scrollBehavior() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          x: 0,
          y: 0
        })
      }, 500)
    })
  }
})
