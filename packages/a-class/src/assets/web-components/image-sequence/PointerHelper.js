export default class PointerHelper {
  static position(element, event) {
    const mouse = {}
    let e = {}
    const rect = element.getBoundingClientRect()
    if (event.targetTouches) {
      e = event.targetTouches[0]
    } else {
      e = event
    }
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top
    return mouse
  }
}
