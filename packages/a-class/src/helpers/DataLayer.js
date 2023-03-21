export default {
  install(Vue, options) {
    Vue.mixin({
      computed: {
        experienceType() {
          let str = this.userinfo.name.length > 0 ? 'personalised' : ''
          str += this.userinfo.isRetail ? ' retail' : ''
          return str.length > 0 ? str : 'standard'
        },
        region() {
          switch (this.userinfo.lang) {
            case 'en':
              return 'UK'
            case 'pt':
              return 'PT'
            case 'de':
              return 'DE'
            default:
              return 'UK'
          }
        }
      },
      methods: {
        trackPage(pageName) {
          let ev = {
            event: 'pageview',
            region: 'UK',
            app: 'eqs-360',
            pageName: pageName || 'eqs-360',
            pageUrl: window.location.href,
            timestamp: Date.now(),
            mode: this.experienceType
          }
          let dataLayer = window.dataLayer || []
          dataLayer.push(ev)
          /* console.log(
            '\n-------------------------\n Datalayer : trackPage \n:',
            JSON.stringify(ev, true, 4)
          )*/
        },
        trackEvent(options) {
          let params = Object.assign(
            {},
            {
              event: 'event',
              region: this.region,
              mode: this.experienceType,
              viewpoint: this.$store.state.viewpoint
            },
            options
          )
          /*console.log(
            '\n-------------------------\n Datalayer : trackEvent \n:',
            JSON.stringify(params, true, 4)
          )*/
          let dataLayer = window.dataLayer || []
          dataLayer.push(params)
        }
      }
    })
  }
}
