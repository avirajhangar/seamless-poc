import { gsap } from 'gsap'
export default {
  install(Vue, options) {
    const player = document.createElement('audio')
    let didPlay = false
    Vue.mixin({
      data() {
        return {
          isAudioPlaying: false,
          selectedTheme: null,
          themeSounds: null
        }
      },
      methods: {
        onSoundClick(theme) {
          if (this.$store.state.isAudioPlaying && this.selectedTheme == theme) {
            this.stopAllAudio()
            return
          }
          var audio = player
          if (!didPlay) {
            this.handleInitalAudioTask(theme)
            didPlay = true
          }
          if (audio !== undefined) {
            gsap.to(audio, {
              volume: 0,
              duration: 1,
              onComplete: () => {
                this.playAudio(theme)
              }
            })
          } else {
            this.selectedSound = theme
            this.$nextTick(() => {
              this.playAudio(theme)
            })
          }
        },
        handleInitalAudioTask(theme) {
          // Fix to deal with safari user initiated media playback
          try {
            var audio = player
            audio.addEventListener('ended', this.onAudioComplete)
            const src = require(`@/assets/audio/SoundExperience/${this.themeSounds[theme].audio.Aura}`)
            audio.setAttribute('src', src)
            gsap.set(audio, { volume: 0 })

            const promise = audio.load()
            if (promise !== null) {
              promise.then(function (_) {
                audio.load()
                audio.play()
                audio.pause()
                audio.currentTime = 0
              })

              promise.catch(() => {})
            }
          } catch (e) {
            /* */
          }
        },
        onAudioComplete() {
          this.$store.commit('playing', { playing: false })
        },
        playAudio(theme) {
          this.selectedTheme = theme
          var audio = player
          const src = require(`@/assets/audio/SoundExperience/${
            this.themeSounds[this.selectedTheme].audio.Aura
          }`)
          audio.setAttribute('src', src)
          gsap.set(audio, {
            volume: 0
          })
          this.$store.commit('playing', { playing: true })
          audio.load()
          audio.play()
          gsap.to(audio, {
            volume: 1,
            duration: 0.5
          })
        },
        stopAllAudio() {
          var audio = player
          if (audio !== undefined) {
            audio.volume = 0
            audio.pause()
            audio.currentTime = 0
          }
          this.$store.commit('playing', { playing: false })
        },
        resumeAudio() {
          var audio = player
          if (audio !== undefined) {
            audio.play()
            gsap.to(audio, {
              volume: 1
            })
          }
          this.$store.commit('playing', { playing: true })
        }
      }
    })
  }
}
