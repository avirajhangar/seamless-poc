<template>
  <button class="btn" :class="getClassByTheme" @click="onClick">{{ urlData.label }}</button>
</template>
<script>
export default {
  name: 'ukscc-CTAButton',
  props: {
    type: {
      type: String,
      required: true,
      default: 'testdrive'
    },
    container: {
      type: String,
      required: true,
      default: ''
    },
    theme: {
      type: String,
      required: false,
      default: 'light'
    }
  },
  computed: {
    getClassByTheme() {
      return {btnLight : this.theme==='light', btnDark : this.theme==='dark' }
    },
    urlData() {
      return this.$appData.urls[
        this.type == 'testdrive'
          ? this.userinfo.isRetail
            ? 'callback'
            : 'testdrive'
          : this.type
      ]
    },
    url() {
      return this.urlData.url
    }
  },

  methods: {
    onClick() {
      this.trackEvent({
        pageName: `modelpage.${this.$store.state.viewpoint}`,
        eventCategory: 'click',
        eventAction: this.container,
        eventLabel: this.urlData.tag
      })

      this.openURL(this.url)
    }
  }
}
</script>
