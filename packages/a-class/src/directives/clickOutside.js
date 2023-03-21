export default {
  bind: (el, binding) => {
    const bubble = binding.modifiers.bubble
    const handler = (e) => {
      if (bubble || (!el.contains(e.target) && el !== e.target)) {
        binding.value(e)
      }
    }
    el.__vueClickOutside__ = handler

    document.addEventListener('click', handler)
    document.addEventListener('touchstart', handler)
  },

  unbind: (el) => {
    document.removeEventListener('click', el.__vueClickOutside__)
    document.removeEventListener('touchstart', el.__vueClickOutside__)

    el.__vueClickOutside__ = null
  }
}
