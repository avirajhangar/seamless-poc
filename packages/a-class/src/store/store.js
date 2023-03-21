import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isAudioPlaying: false,
    didStartAudio: false,
    dataLoaded: false,
    viewpoint: ''
  },
  mutations: {
    playing(state, payload) {
      state.isAudioPlaying = payload.playing
      state.didStartAudio = true
    },
    viewpoint(state, payload) {
      state.viewpoint = payload
    },
    dataLoded(state, payload) {
      state.dataLoaded = payload.loaded
    }
  }
})
