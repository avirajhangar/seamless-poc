import * as THREE from 'three'

export default function CubeCanvasTexture(backgrounds, isHyperScreen) {
  var hue = 220
  var sat = 90

  var _selectedImage = ''

  // Is the ambient light switch on
  var isLightsOn = false

  const ctx = document.createElement('canvas').getContext('2d')
  ctx.canvas.width = 4096
  ctx.canvas.height = 2048

  // Offscreen canvas to apply the hues
  const offscreenctx = document.createElement('canvas').getContext('2d')
  offscreenctx.canvas.width = 4096
  offscreenctx.canvas.height = 2048

  this.canvas = ctx.canvas

  var path = './images/interiors/'

  var images = backgrounds.reduce((result, item, i) => {
    result[item.code] = {
      background: {
        src: `${path}${item.code}/${item.image}`,
        img: null,
        preload: i === 0
      },
      ambient: {
        src: `${path}${item.code}/ambient-${item.image}`,
        img: null,
        preload: i === 0
      }
    }
    return result
  }, {})

  this.setHue = function (_hue, _sat) {
    hue = _hue
    sat = _sat
    this.render()
  }

  this.render = function () {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.drawImage(
      images[_selectedImage].background.img,
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    )

    if (isLightsOn) {
      offscreenctx.save()

      //  1: Draw origional lighting layer
      offscreenctx.globalCompositeOperation = 'source-over'
      offscreenctx.drawImage(
        images[_selectedImage].ambient.img,
        0,
        0,
        offscreenctx.canvas.width,
        offscreenctx.canvas.height
      )

      // 2: adjust saturation (chroma, intensity)
      offscreenctx.globalCompositeOperation = 'saturation'
      offscreenctx.fillStyle = 'hsl(0,' + sat + '%, 45%)'
      offscreenctx.fillRect(
        0,
        0,
        offscreenctx.canvas.width,
        offscreenctx.canvas.height
      )

      // 3: adjust hue, preserve luma and chroma
      offscreenctx.globalCompositeOperation = 'hue'
      offscreenctx.fillStyle = 'hsl(' + hue + ',50%, 50%)'
      offscreenctx.fillRect(
        0,
        0,
        offscreenctx.canvas.width,
        offscreenctx.canvas.height
      )

      // 4: fill with new hue
      offscreenctx.globalCompositeOperation = 'screen'
      offscreenctx.globalAlpha = 0
      offscreenctx.drawImage(
        images[_selectedImage].ambient.img,
        0,
        0,
        offscreenctx.canvas.width,
        offscreenctx.canvas.height
      )

      // 5: reset comp mode to default
      offscreenctx.globalCompositeOperation = 'source-over'
      offscreenctx.restore()

      // 6: draw back to ctx with blend modee to remoe black
      ctx.globalCompositeOperation = 'screen'
      ctx.drawImage(offscreenctx.canvas, 0, 0)
    }
  }

  Object.defineProperty(this, 'lightsOn', {
    get: function () {
      return isLightsOn
    },
    set: function (val) {
      isLightsOn = val

      this.render()
    }
  })

  this.isLoaded = (key) => {
    return (
      images[key].background.img !== null && images[key].ambient.img !== null
    )
  }

  this.loadImage = (key, progress, complete) => {
    var manager = new THREE.LoadingManager()
    manager.onProgress = function (item, loaded, total) {
      progress(item, loaded, total)
    }
    manager.onLoad = function () {
      _selectedImage = key
      this.render()
      complete()
    }
    manager.onError = function () {
      console.log('Error loading assets')
    }

    let textureLoader = new THREE.TextureLoader(manager)
    for (let i in images[key]) {
      textureLoader.load(images[key][i].src, (texture) => {
        texture.encoding = THREE.sRGBEncoding
        images[key][i].img = texture.image
      })
    }
  }
  Object.defineProperty(this, 'selectedImage', {
    get: function () {
      return _selectedImage
    },
    set: function (val) {
      _selectedImage = val
      this.render()
    }
  })
}
