export default {
  inserted: (el, value) => {
    function handleIntersect(entries, observer) {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0 && entry.intersectionRatio < 1) {
          value.value.enter()
        } else {
          value.value && value.value.leave && value.value.leave()
        }
      })
    }

    function createObserver() {
      const options = {
        root: null,
        rootMargin: '100px',
        threshold: [0]
      }
      const observer = new IntersectionObserver(handleIntersect, options)
      observer.observe(el)
    }
    if (window['IntersectionObserver']) {
      createObserver()
    } else {
      console.log('Unable to create IntersectionObserver')
    }
  }
}
