import * as THREE from 'three'

/**
 *
 * Hotspots Manager.
 *
 *
 */
export default function HotspotManager(scene, camera, data) {
  const SHOW_LABELS = false

  var HOTSPOT_COLOR_INNER = 'rgba(255,255,255,0.5)'
  var HOTSPOT_COLOR_OUTER = 'rgba(255,255,255,1)'
  var HOTSPOT_SELECTED_COLOR_INNER = 'rgba(255,255,255,0.5)'
  var HOTSPOT_SELECTED_COLOR_OUTER = 'rgba(255,255,255,1)'

  var defaultWidth = 1000
  var defaultHeight = 100
  var width = 0,
    height = 0
  var hotspotRadius = 20
  var scale = 3

  var selectedHotspotID = null

  // Container for the hotspots.
  var hotspotsCanvas

  var ctx
  var hotspots = []
  // store the current hotspots.
  var hotspotsData = data

  // properties.
  this._showing = true
  this.scene = scene
  this.camera = camera

  this.init = function () {
    this.createHotspotCanvas()
    this.hide()
    this.loadHotspots(hotspotsData)
  }

  this.onWindowResized = function (w, h) {
    hotspotsCanvas.width = w
    hotspotsCanvas.height = h
    scale = defaultWidth / w
    width = w
    height = h
  }

  // Initialise the new data
  this.loadHotspots = function (_hotspots) {
    // Remove all hotspots.
    while (hotspotsCanvas.hasChildNodes()) {
      hotspotsCanvas.removeChild(hotspotsCanvas.lastChild)
    }
    hotspots = []
    // add all the new hotspots.
    for (var i = 0; i < _hotspots.length; i++) {
      this.createHotspot(_hotspots[i]) // COMMAND
    }
  }

  this.createHotspotCanvas = function () {
    // Create  the canvas to hold the hotspots.
    hotspotsCanvas = document.getElementById('hotspotscanvas')
    hotspotsCanvas.style.position = 'absolute'
    hotspotsCanvas.style.top = '0px'
    hotspotsCanvas.style.display = 'block'
    hotspotsCanvas.style.zIndex = '10'
    hotspotsCanvas.style.pointerEvents = 'none'
    ctx = hotspotsCanvas.getContext('2d')
    ctx.mozImageSmoothingEnabled = true
    ctx.webkitImageSmoothingEnabled = true
  }

  // checks if the mouse is within any of the hotspots
  this.checkIfClickedHotspot = function (event) {
    var mouse = this.getMousePosition(event)
    var mousePoint = {
      x: mouse.offsetX,
      y: mouse.offsetY
    }
    var hitTest
    for (var i = 0; i < hotspots.length; i++) {
      var point = this.point3DToScreen2D(hotspots[i])
      hitTest = this.isCursorWithinCircle(
        point,
        mousePoint,
        hotspotRadius * scale * 1.75
      )

      if (hitTest) {
        selectedHotspotID = hotspots[i].id
        return hotspots[i].id
      }
    }
    return false
  }

  // Detected whether a point is within a circke.
  this.isCursorWithinCircle = function (shapePoint, mousePoint, r) {
    var distSqr =
      Math.pow(shapePoint.x - mousePoint.x, 2) +
      Math.pow(shapePoint.y - mousePoint.y, 2)
    if (distSqr < r * r) {
      return true
    }
    return false
  }

  this.getPointerEvent = function (event) {
    return event.touches ? event.touches[0] : event
  }

  this.getMousePosition = function (event) {
    var e
    if (event.changedTouches) {
      e = event.changedTouches[0]
    } else {
      e = event.targetTouches ? event.targetTouches[0] : event
    }
    var mouse = {}
    mouse.offsetX = event.touches ? e.clientX : e.clientX
    mouse.offsetY = event.touches ? e.clientY : e.clientY
    return mouse
  }

  this.createHotspot = function (hotspot) {
    var object = new THREE.Object3D()
    object.name = hotspot.id
    object.position.x = hotspot.vector.x
    object.position.y = hotspot.vector.y
    object.position.z = hotspot.vector.z
    scene.add(object)
    var item = {
      id: hotspot.id,
      object: object,
      data: hotspot,
      img: null
    }
    hotspots.push(item)
  }

  this.render = function (_theta, _phi) {
    var w = hotspotsCanvas.width
    var h = hotspotsCanvas.height
    let radius = Math.min(hotspotRadius / scale, 20)
    radius = Math.max(radius, 15)

    ctx.clearRect(0, 0, w, h)
    if (!this._showing) {
      return
    }
    for (var i = 0; i < hotspots.length; i++) {
      // Check if hotspot vector is in the view.
      var point = this.point3DToScreen2D(hotspots[i])

      if (point) {
        if (SHOW_LABELS) {
          // Fill with gradient
          ctx.fillStyle = '#000000'
          ctx.font = 21 / scale + 'px daimler_csregular'
          ctx.fillText(
            hotspots[i].data.title,
            1 + point.x + radius + 10,
            1 + point.y + radius / 2
          )

          ctx.fillStyle = '#ffffff'
          ctx.font = 21 / scale + 'px daimler_csregular'
          ctx.fillText(
            hotspots[i].data.title,
            point.x + radius + 10,
            point.y + radius / 2
          )
        }

        let r = hotspots[i].id == selectedHotspotID ? radius / 2 : radius / 2
        ctx.fillStyle =
          hotspots[i].id == selectedHotspotID
            ? HOTSPOT_SELECTED_COLOR_INNER
            : HOTSPOT_COLOR_INNER
        ctx.beginPath()
        ctx.arc(point.x, point.y, r * 2, 0, 2 * Math.PI)
        ctx.fill()

        ctx.fillStyle =
          hotspots[i].id == selectedHotspotID
            ? HOTSPOT_COLOR_OUTER
            : HOTSPOT_SELECTED_COLOR_OUTER

        ctx.beginPath()
        ctx.arc(point.x, point.y, r, 0, 2 * Math.PI)
        ctx.fill()
      }
    }
  }

  this.deselectAll = function () {
    selectedHotspotID = null
  }

  this.point3DToScreen2D = function (hotspot) {
    var object = hotspot.object

    // Check if hotspot vector is in the view.
    var vector = new THREE.Vector3(0, 0, -1)
    vector.applyQuaternion(camera.quaternion)
    var angle = vector.angleTo(object.position)
    if (angle > 1.5) {
      return false
    }
    var widthHalf = width / 2,
      heightHalf = height / 2

    var vectorB = new THREE.Vector3()
    vectorB = vectorB.setFromMatrixPosition(object.matrixWorld)
    vectorB.project(camera)
    vectorB.x = vectorB.x * widthHalf + widthHalf
    vectorB.y = -(vectorB.y * heightHalf) + heightHalf
    return vectorB
  }

  this.hide = function () {
    hotspotsCanvas.className = 'hidden'
    this.render()
  }

  this.show = function () {
    hotspotsCanvas.className = 'showing'
    this.render()
    setTimeout(this.render, 200)
  }

  // Getters / Setters.

  this.getCanvas = function () {
    return hotspotsCanvas
  }

  this.getHotspots = function () {
    return hotspots
  }

  Object.defineProperty(this, 'showing', {
    get: function () {
      return this._showing
    },
    set: function (val) {
      this._showing = val
      if (this._showing) {
        this.show()
      } else {
        this.hide()
      }
    }
  })

  this.init()
  return this
}

HotspotManager.prototype = {
  get speed() {
    return this._speed
  },
  destroy: function () {
    this.destroy()
  }
}
export { HotspotManager }
