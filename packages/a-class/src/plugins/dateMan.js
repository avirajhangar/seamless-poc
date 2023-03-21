export default {
  install(Vue, options) {
    let path = `/data/app_data_${options.lang}.json`
    fetch(path)
      .then((r) => r.json())
      .then(
        (json) => {
          Vue.prototype.$appData = json
        },
        (response) => {
          console.log('Error loading json:', response)
        }
      )
  }
}
