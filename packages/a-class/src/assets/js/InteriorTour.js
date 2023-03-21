import * as THREE from 'three'
import HotspotManager from './HotspotManager.js'
import { TimelineLite, gsap } from 'gsap'
import { OrbitControls } from './OrbitControls.js'
import { DeviceOrientationControls } from './DeviceOrientationControls.js'
import * as Dat from 'dat.gui/build/dat.gui.js'
import isMobile from 'ismobilejs'
import CubeCanvasTexture from './CubeCanvasTexture.js'

export default function InteriorTour(
  _container,
  _hotspotData,
  _backgrounds,
  _isHyperScreen,
  _isStatic,
  callback,
  _loadProgress
) {
  let backgrounds = _backgrounds
  const IS_DEBUG = false
  let isInitialised = false
  let appStarted = false
  var _isPaused = false
  var isStatic = _isStatic
  let hotspotClickCallback = callback
  let hotspotData = _hotspotData
  let loadProgressCallback = _loadProgress
  let container = document.getElementById(_container)
  let width = container.clientWidth
  let height = container.clientHeight
  let gui = IS_DEBUG ? new Dat.GUI({ autoplace: false }) : null
  let scene,
    camera,
    renderer,
    controls,
    orbitControls,
    deviceOrientationControls

  let cubeCanvasTexture = new CubeCanvasTexture(backgrounds, _isHyperScreen)
  var canvasTexture

  const geometry = new THREE.SphereBufferGeometry(30, 32, 32)
  var hotspot = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: 0x00adef, side: THREE.DoubleSide })
  )

  var axesHelper = new THREE.AxesHelper(5)
  if (IS_DEBUG) hotspot.add(axesHelper)

  // Container for GUI
  var customContainer = document.getElementById('gui-container')
  if (IS_DEBUG) customContainer.appendChild(gui.domElement)

  var hotspotmanager
  var init = function () {
    canvasTexture = new THREE.CanvasTexture(cubeCanvasTexture.canvas)

    let defaultCode = backgrounds[0].code
    cubeCanvasTexture.loadImage(
      defaultCode,
      (item, loaded, total) => {
        loadProgressCallback(loaded / total)
      },
      () => {
        cubeCanvasTexture.selectedImage = defaultCode
        canvasTexture.needsUpdate = true
        setUpScene()
      }
    )

    if (IS_DEBUG) setupGUI()
  }

  var renderTarget

  function setUpScene(texture) {
    // Only scene
    scene = new THREE.Scene()
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setClearColor(0xff0000, 1)

    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    renderTarget = new THREE.WebGLCubeRenderTarget(canvasTexture.image.height)
    renderTarget.fromEquirectangularTexture(renderer, canvasTexture)
    scene.background = renderTarget.texture

    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000)
    camera.position.set(-8, -308, 0.005)
    camera.updateProjectionMatrix()

    if (IS_DEBUG) {
      // For getting a position
      hotspot.position.set(
        settings.hotspot.x,
        settings.hotspot.y,
        settings.hotspot.z
      )
      hotspot.name = 'hotspot1'
      scene.add(hotspot)
    }
    initialiseHotspots()
    isInitialised = true
    this.onWindowResize()
    setupOrbitControls()
    startTour()
    render()
  }

  function showStartAnimation(complete) {
    gsap.to(camera.position, 1, {
      x: -38,
      y: 3.7,
      z: -1,
      delay: 0,
      onComplete: complete,
      onUpdate: () => {
        if (controls) controls.update()
        camera.updateProjectionMatrix()
        render()
      }
    })
  }

  var initialiseHotspots = () => {
    hotspotmanager = new HotspotManager(scene, camera, hotspotData)
    initialiseTimeline()
    this.onWindowResize()
  }

  this.onChangeHue = function (degree) {
    cubeCanvasTexture.setHue(degree, 120)
    this.updateRender()
  }

  // Change the interior leathers.
  this.changeInterior = (code, complete) => {
    if (cubeCanvasTexture.isLoaded(code)) {
      cubeCanvasTexture.selectedImage = code
      this.updateRender()
      complete()
    } else {
      cubeCanvasTexture.loadImage(
        code,
        (progress) => {
          // console.log('progress')
        },
        () => {
          cubeCanvasTexture.selectedImage = code
          this.updateRender()
          complete()
        }
      )
    }
  }

  this.updateRender = function () {
    canvasTexture.needsUpdate = true
    renderTarget.fromEquirectangularTexture(renderer, canvasTexture)
    scene.background = renderTarget.texture
    render()
  }

  this.setAmbientLightsStatus = function (lightsOn) {
    if (cubeCanvasTexture.lightsOn && lightsOn) return
    this.lightsOn = cubeCanvasTexture.lightsOn = lightsOn
    this.updateRender()
  }

  this.onWindowResize = function () {
    if (!isInitialised) {
      return
    }
    camera.aspect = container.clientWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, window.innerHeight)
    if (hotspotmanager) {
      hotspotmanager.onWindowResized(window.innerWidth, window.innerHeight)
    }
    initialiseTimeline()
    render()
  }

  var onClick = function (event) {
    event.preventDefault()
    var hotspotClicked = hotspotmanager.checkIfClickedHotspot(event)
    if (hotspotClicked) {
      hotspotClickCallback(hotspotClicked)
    }
  }

  // Event Handellers.
  var addEventListeners = function () {
    renderer.domElement.addEventListener('touchstart', onPointerStart, {
      passive: true
    })
    renderer.domElement.addEventListener('touchmove', onPointerMove, {
      passive: true
    })
    renderer.domElement.addEventListener('touchend', onPointerUp, {
      passive: true
    })
  }

  var removeEventListeners = function () {
    renderer.domElement.addEventListener('touchstart', onPointerStart, {
      passive: true
    })
    renderer.domElement.addEventListener('touchmove', onPointerMove, {
      passive: true
    })
    renderer.domElement.addEventListener('touchend', onPointerUp, {
      passive: true
    })
  }

  var isUserInteracting = false,
    onMouseDownMouseX = 0,
    onMouseDownMouseY = 0,
    lon = 0,
    onMouseDownLon = 0,
    lat = 0,
    onMouseDownLat = 0

  function onPointerStart(event) {
    isUserInteracting = true
    var hotspotClicked = hotspotmanager.checkIfClickedHotspot(event)
    if (hotspotClicked) {
      hotspotClickCallback(hotspotClicked)
    }
    var clientX = event.clientX || event.touches[0].clientX
    var clientY = event.clientY || event.touches[0].clientY
    onMouseDownMouseX = clientX
    onMouseDownMouseY = clientY
    onMouseDownLon = lon
    onMouseDownLat = lat
  }

  // offfset the camera if use deviceorientation
  function onPointerMove(event) {
    if (isUserInteracting === true) {
      var clientX = event.clientX || event.touches[0].clientX
      var clientY = event.clientY || event.touches[0].clientY
      lon = (onMouseDownMouseX - clientX) * 0.01 + onMouseDownLon
      if (isMobileDevice()) {
        controls.alphaOffset = lon
      }
    }
  }

  function onPointerUp() {
    isUserInteracting = false
  }

  var render = function () {
    if (!isInitialised) {
      return
    }
    renderer.render(scene, camera)
    if (hotspotmanager) hotspotmanager.render()
  }

  // Animation Look
  function animate() {
    if (!_isPaused) {
      if (controls) controls.update()
      if (!isStatic) requestAnimationFrame(animate)
      render()
    }
  }

  this.destroy = function () {
    removeEventListeners()
    cancelAnimationFrame(animate)
    // if (scene) scene.dispose()
    if (container) container.removeChild(renderer.domElement)
    if (renderer) renderer.dispose()
    if (controls) controls.dispose()
  }

  let updatingPlayheadTimer = null
  let updatingPlayhead = false
  this.offsetAnimationScroll = (progress) => {
    updatingPlayhead = true
    timeline.progress(progress)
    clearTimeout(updatingPlayheadTimer)
    updatingPlayheadTimer = setTimeout(() => {
      updatingPlayhead = false
    }, 500)
  }

  var progress = 0
  var timeline = null

  function initialiseTimeline() {
    if (timeline) {
      progress = timeline.progress()
      timeline.kill()
    }
    timeline = new TimelineLite({
      paused: true,
      repeat: -1,
      yoyo: true,
      onUpdate: () => {
        render()
        if (controls) controls.update()
      }
    })

    timeline.to(camera.position, { x: -38, y: 3.7, z: -1 })
    timeline.to(camera.position, { x: -38, y: 3.7, z: -1 })
    timeline.to(camera.position, {
      x: 13,
      y: 2,
      z: -35
    })
    timeline.to(camera.position, {
      x: 35.70986554538035,
      y: 2.869910701402331,
      z: 1.0050264209541353
    })
    timeline.to(camera.position, {
      x: -7.935288131941539,
      y: 1.659349916403201,
      z: 34.910152147018685
    })
    timeline.to(camera.position, { x: -38, y: 3.7, z: -1 })
    timeline.progress(progress)
  }

  function isMobileDevice() {
    const ua = navigator.userAgent
    const isIOS =
      (/iPad|iPhone|iPod/.test(navigator.platform) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
      !window.MSStream
    return isMobile(ua).any || isIOS
  }

  this.setOrbit = function () {
    isStatic = true
    this.deviceControlled = 0
    if (deviceOrientationControls) {
      deviceOrientationControls.disconnect()
      deviceOrientationControls.enabled = false
    }
    controls = orbitControls
    controls.update()
  }

  this.setDeviceControls = function () {
    addEventListeners()
    if (!deviceOrientationControls) {
      deviceOrientationControls = new DeviceOrientationControls(camera)
    }
    deviceOrientationControls.connect()
    deviceOrientationControls.enabled = true
    controls = deviceOrientationControls
    this.deviceControlled = 1
    isStatic = false
  }

  // L'ancien controle pour mobile (eqs)
  // si l'utilisateur a droit de naviguer en 360° ou pas
  this.deviceControlled = 0
  this.toggleControls = function (event) {
    removeEventListeners()
    if (isMobileDevice()) {
      this.deviceControlled = this.deviceControlled === 1 ? 0 : 1
      if (this.deviceControlled == 0) {
        this.setOrbit()
      } else {
        this.setDeviceControls()
        this._isPaused = false
        animate()
      }
    }
    return this.deviceControlled
  }

  // Check if Orientation Events available.
  function isDeviceOrientationAvalable() {
    return (
      typeof DeviceOrientationEvent.requestPermission === 'function' &&
      window.DeviceOrientationEvent &&
      'ontouchstart' in window
    )
  }

  // orbitControls, deviceOrientationControls
  this.startApp = function (event) {
    this.onWindowResize()
    if (isMobileDevice() && isDeviceOrientationAvalable()) {
      window.DeviceOrientationEvent.requestPermission().then(function (result) {
        if (result == 'denied') {
          this.deviceControlled = 0
          setupOrbitControls()
        } else {
          this.deviceControlled = 1
          deviceOrientationControls = new DeviceOrientationControls(camera)
          deviceOrientationControls.connect()
          controls = deviceOrientationControls
          addEventListeners()
        }
        startTour()
      })
    } else {
      this.deviceControlled = 0
      setupOrbitControls()
      startTour()
    }
  }

  function setupOrbitControls() {
    orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.enableDamping = true
    orbitControls.enableZoom = false
    orbitControls.enableKeys = false
    orbitControls.rotateSpeed = 0.5
    orbitControls.rotateSpeed *= -1
    orbitControls.minDistance = 0.001
    orbitControls.maxDistance = 105
    orbitControls.dampingFactor = 0.075
    orbitControls.screenSpacePanning = false
    orbitControls.addEventListener('change', () => {
      if (!updatingPlayhead) {
        render()
      }
    })
    controls = orbitControls
    this.deviceControlled = 0
  }

  function startTour() {
    appStarted = true
    render()
    showStartAnimation(() => {
      animate()
    })
  }
  var hasListener
  this.setPointerEvents = (active) => {
    if (!renderer) return
    if (active) {
      this._isPaused = false
      if (hasListener) return
      hasListener = true
      renderer.domElement.addEventListener('click', onClick, false)
      renderer.domElement.addEventListener('touchend', onClick, false)
    } else {
      this._isPaused = true
      renderer.domElement.removeEventListener('click', onClick, false)
      renderer.domElement.removeEventListener('touchend', onClick, false)
      hasListener = false
      this.setOrbit()
    }
  }
  var settings = {
    animated: false,
    camera: {
      fov: 75,
      near: 0.1,
      far: 100000,
      update: () => {
        camera.fov = settings.camera.fov
        camera.near = settings.camera.near
        camera.far = settings.camera.far

        controls.target.set(
          settings.camera.target.x,
          settings.camera.target.y,
          settings.camera.target.z
        )
        controls.update()
        camera.updateProjectionMatrix()
      },
      target: {
        x: 0,
        y: 0,
        z: 0
      },
      position: {
        x: 0,
        y: 0,
        z: 0
      }
    },
    hotspot: {
      x: 3000,
      y: 5000,
      z: 0.6,
      update: () => {
        hotspot.position.x = settings.hotspot.x
        hotspot.position.y = settings.hotspot.y
        hotspot.position.z = settings.hotspot.z

        var s = ` "vector": {
              "x": ${settings.hotspot.x},
              "y": ${settings.hotspot.y},
              "z": ${settings.hotspot.z}
            },`

        render()
      }
    }
  }

  var setupGUI = function () {
    let labels = hotspotData.map((item) => {
      return item.title
    })

    var selection = {
      id: 'someName'
    }
    gui.add(selection, 'id', labels).onChange(function (val, valb) {
      var result = hotspotData.filter((item) => item.title === val)[0]

      settings.hotspot.x = result.vector.x
      settings.hotspot.y = result.vector.y
      settings.hotspot.z = result.vector.z
      settings.hotspot.update()

      gui.removeFolder('Hotspot')

      f = gui.addFolder('Hotspot')
      f.add(settings.hotspot, 'x', -2000, 2000, 0.05).onChange(
        settings.hotspot.update
      )
      f.add(settings.hotspot, 'y', -2000, 2000, 0.05).onChange(
        settings.hotspot.update
      )
      f.add(settings.hotspot, 'z', -2000, 2000, 0.05).onChange(
        settings.hotspot.update
      )

      console.log(result)
    })

    gui.add(settings, 'animated', true, false).onChange(function (val) {
      var s = ` "camera": {
            "x": ${camera.position.x},
            "y": ${camera.position.y},
            "z": ${camera.position.z},
            "rotation":{
              "x": ${camera.rotation.x},
              "y":${camera.rotation.y},
              "z":${camera.rotation.z}
            },
            "fov":${camera.fov}
          },`
      console.log('changes\n\n', s)
    })
    var f = gui.addFolder('Camera')
    f.add(settings.camera, 'fov', 0, 100, 1).onChange(settings.camera.update)
    f.add(settings.camera, 'near', 0, 100, 1).onChange(settings.camera.update)
    f.add(settings.camera, 'far', 0, 100000, 1).onChange(settings.camera.update)
    var target = f.addFolder('Target')
    f.add(settings.camera.target, 'x', 0, 10, 0.05).onChange(
      settings.camera.update
    )
    f.add(settings.camera.target, 'y', 0, 10, 0.05).onChange(
      settings.camera.update
    )
    f.add(settings.camera.target, 'z', 0, 10, 0.05).onChange(
      settings.camera.update
    )
    f.addFolder('Posittion')
    f.add(settings.camera.position, 'x', 0, 10, 0.05).onChange(
      settings.camera.update
    )
    f.add(settings.camera.position, 'y', 0, 10, 0.05).onChange(
      settings.camera.update
    )
    f.add(settings.camera.position, 'z', 0, 10, 0.05).onChange(
      settings.camera.update
    )

    f = gui.addFolder('Hotspot')
    f.add(settings.hotspot, 'x', -2000, 2000, 0.05).onChange(
      settings.hotspot.update
    )
    f.add(settings.hotspot, 'y', -2000, 2000, 0.05).onChange(
      settings.hotspot.update
    )
    f.add(settings.hotspot, 'z', -2000, 2000, 0.05).onChange(
      settings.hotspot.update
    )

    Dat.GUI.prototype.removeFolder = function (name) {
      var folder = this.__folders[name]
      if (!folder) {
        return
      }
      folder.close()
      this.__ul.removeChild(folder.domElement.parentNode)
      delete this.__folders[name]
      this.onResize()
    }
  }

  this.update = function () {
    render()
  }

  this.deselectHotspots = function () {
    hotspotmanager.deselectAll()
  }

  // Start
  init()

  Object.defineProperty(this, 'isPaused', {
    get: function () {
      return _isPaused
    },
    set: function (val) {
      if (!appStarted) {
        return
      }
      window.cancelAnimationFrame(animate)
      _isPaused = val
      if (!_isPaused) {
        if (controls) controls.enabled = true
        this.setPointerEvents(true)
        requestAnimationFrame(animate)
        // permettre le changement de position de la caméra lors du scroll
        if (timeline) {
          timeline.clear(true);
          initialiseTimeline()
        }
      } else {
        if (controls) controls.enabled = false
        this.setPointerEvents(true)
        // On bloque le changement de position de la caméra lors du scroll  pour  que les hotspots soient toujours en vu
        if (timeline) {
          timeline.clear(true);
        }
      }
    }
  })
}

InteriorTour.prototype = {
  get control() {
    return this.deviceControlled
  },
  animateCamera: function (data) {
    this.onAnimataeCaameraToHotspot(data)
  },

  destroy: function () {
    this.destroy()
  }
}
export { InteriorTour }
