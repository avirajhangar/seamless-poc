const mobileBrowser = {
  Android: function () {
    return navigator.userAgent.match(/Android/i)
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i)
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i)
  },
  iPad: function() {
    return navigator.userAgent.match(/iPad/i)
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i)
  },
  Windows: function () {
    return (
      navigator.userAgent.match(/IEMobile/i) ||
      navigator.userAgent.match(/WPDesktop/i)
    )
  },
  any: function () {
    return (
      mobileBrowser.Android() ||
      mobileBrowser.BlackBerry() ||
      mobileBrowser.iOS() ||
      mobileBrowser.Opera() ||
      mobileBrowser.Windows()
    )
  }
}

export default {
  install(Vue, options) {
    Vue.prototype.$isMobile = () => {
      return mobileBrowser.any()
    }
    Vue.prototype.$isIpad = () => {
      return mobileBrowser.iPad()
    }
  }
}
