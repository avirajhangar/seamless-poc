const template = document.createElement('template')
template.innerHTML = `
<style>
    :host {
	    display: block;
        font-family: sans-serif;
        width:100%;
        height:100%;
        overflow:hidden;
        position:absolute;
        top:0;
    }

    
    .image_sequence_wrapper{
      /*  width: 100%;
        padding-top: 56.25%;
        position: relative;*/
    } 
    
    #image_sequence{
        opacity:1;
    }
    
    #hotspots{
        pointer-events: none;
        z-index:2;
    }
    .image_sequence{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
    }
    
    .image_sequence_loader{
        transition: all 0.3s ease-in;
        opacity:0;
        pointer-events:none;
    }

    .image_sequence_loader.active{
       // transition: all 0.3s ease-in;

        animation: circle 1.5s infinite;

    }
    .overlay{
        position: absolute;
        top: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        left: 0;
        pointer-events:none;
    }

    @keyframes circle {
        from {
        /*  -webkit-clip-path: circle(0%);
          clip-path: circle(0%);*/
           opacity:0;
        }
        to {
        /*  -webkit-clip-path: circle(120px);
          clip-path: circle(100%);*/
          opacity:1;
        }
      }

</style>
<div class="image_sequence_wrapper">
    <canvas width="1920" height="1080" id="image_sequence" class="image_sequence" ></canvas>
    <canvas width="1920" height="1080" id="image_sequence_loader" class="image_sequence image_sequence_loader"></canvas>
    <canvas width="1920" height="1080" id="hotspots" class="image_sequence" ></canvas>
  <!--  <img class="overlay" src="assets/images/overlay.png">-->
</div>
`
import PointerHelper from './PointerHelper.js'
import BatchLoader from './BatchLoader.js'
import HotspotTracker from './HotspotTracker.js'
const useQuarter = false
const isDebug = false
class ImageSequence extends HTMLElement {
  constructor() {
    super()
    this.hasEventListeners = false
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(template.content.cloneNode(true))
    this.$canvasView = this._shadowRoot.querySelector('#image_sequence')
    this.$ctx = this.$canvasView.getContext('2d', { alpha: false })
    this.$ctx.imageSmoothingEnabled = true
    this.$ctx.imageSmoothingQuality = 'high'
    this.$ctx.mozImageSmoothingEnabled = true
    this.$ctx.webkitImageSmoothingEnabled = true

    this.$canvasLoaderView = this._shadowRoot.querySelector(
      '#image_sequence_loader'
    )
    this.$ctxLoader = this.$canvasLoaderView.getContext('2d')
    this.$ctxLoader.imageSmoothingEnabled = true
    this.$ctxLoader.imageSmoothingQuality = 'high'

    this._x = 0
    this._mousewheel = true
    this._isInteractive = false
    this._filetype = '.jpg'
    this._filename = ''
    this._folder = ''
    this.hotspotOptions = {}

    this._point = { x: 0, y: 0 }
    this._previousPoint = { x: 0, y: 0 }
    this._virtualPoint = { x: 0, y: 0 }
    this._frameIndex = 0
    this._previousFrameIndex = 0
    this.scale = 1
    this.sliderBounds = {
      top: this.$ctx.canvas.height - 250 * this.scale,
      left: 300 * this.scale,
      width: this.$ctx.canvas.width - 600 * this.scale,
      height: 2
    }
    this._kThreshold = this.sliderBounds.width

    this._speedX = 0
    this._kFriction = 0.97
    this._direction = 1
    this.animationLoop = null

    this.dragging = false
    this.moveHandeller = this.onMoveEvent.bind(this)
    this.animateHandeller = this.animate.bind(this)

    this.batchLoader = {}

    if (useQuarter) {
      this.frameIndeces = [3, 13, 22, 31]
    } else {
      this.frameIndeces = Array.from(Array(78), (d, i) => i)
    }
    this._totalFrames = 0 // this.frameIndeces.length
    this.isLoaded = false
    this.isLoading = false
  }

  load() {
    this.frameIndeces = Array.from(Array(this.totalFrames), (d, i) => i)
    this.batchLoader = new BatchLoader({
      complete: this.onBatchLoaderComplete.bind(this),
      progress: this.onBatchLoaderProgress.bind(this),
      folder: this._folder,
      filename: this._filename,
      filetype: this._filetype,
      total: this.totalFrames,
      frameIndeces: this.frameIndeces
    })
    this.isLoading = true
    if (isDebug) this.loadHotspots({})
  }

  loadHotspots(hotspotData) {
    const options = {
      _callback: this.onHotspotClicked.bind(this),
      canvas: this._shadowRoot.querySelector('#hotspots'),
      _size: {
        width: 1920,
        height: 1080
      },
      _origionalSize: {
        width: 1920,
        height: 1080
      },
      data: hotspotData
    }

    if (this.hotspots) {
      delete this.hotspots
    }

    if (isDebug) {
      this.hotspots = new HotspotTracker(this, options)
      this.hotspots.resizeCanvas(window.innerWidth)
    }
  }
  prerender() {
    if (this._frameIndex != this._previousFrameIndex) {
      //  this._render();
      if (this.hotspots) {
        this.hotspots.onFrameChanged(this._frameIndex)
      }
      this.dispatchEvent(
        new CustomEvent('FRAME_CHANGED', {
          bubbles: true,
          detail: { frame: this._frameIndex }
        })
      )
      this._render()
    }
    this._previousFrameIndex = this._frameIndex
  }
  onBatchLoaderComplete() {
    this.isLoaded = true

    if (!this.hasEventListeners) {
      this.addEventListeners()
    }

    this.update()
    //  this.prerender();
    this.renderFirstFrameTheExit()

    if (this.hotspots) {
      this.hotspots.onFrameChanged(this._frameIndex)
    }
    this.dispatchEvent(
      new CustomEvent('loadprogress', {
        bubbles: true,
        detail: { index: this.totalFrames - 1, progress: 1 }
      })
    )
    this.dispatchEvent(
      new CustomEvent('loadcomplete', {
        bubbles: true,
        detail: { index: this.totalFrames - 1, progress: 1 }
      })
    )
  }

  onHotspotClicked(data) {
    this.dispatchEvent(
      new CustomEvent('clicked', { bubbles: true, detail: data })
    )
  }

  onBatchLoaderProgress(index, progress) {
    // console.log(index)
    this.dispatchEvent(
      new CustomEvent('loadprogress', {
        bubbles: true,
        detail: { index: index, progress: progress }
      })
    )
  }

  addEventListeners() {
    // Touch
    this.$canvasView.addEventListener(
      'touchstart',
      this.onTouchStart.bind(this),
      { passive: false }
    )
    this.$canvasView.addEventListener('touchend', this.onTouchEnd.bind(this))
    // Mouse

    this.$canvasView.addEventListener(
      'mousedown',
      this.onTouchStart.bind(this),
      { passive: false }
    )
    this.$canvasView.addEventListener('mouseup', this.onTouchEnd.bind(this))
    this.$canvasView.addEventListener('mouseleave', this.onTouchEnd.bind(this))
    this.$canvasView.addEventListener('mouseout', this.onTouchEnd.bind(this))

    if (this._mousewheel) {
      this.$canvasView.addEventListener('wheel', this.onMouseWheel.bind(this), {
        passive: false
      })
    }
    this.hasEventListeners = true
    // Window
    window.addEventListener('resize', this.onResize.bind(this))
  }

  removeEventListeners() {
    this.$canvasView.removeEventListener(
      'touchstart',
      this.onTouchStart.bind(this)
    )
    this.$canvasView.removeEventListener('touchend', this.onTouchEnd.bind(this))
    this.$canvasView.removeEventListener(
      'mousedown',
      this.onTouchStart.bind(this),
      { passive: true }
    )
    this.$canvasView.removeEventListener('mouseup', this.onTouchEnd.bind(this))
    this.$canvasView.removeEventListener(
      'mouseleave',
      this.onTouchEnd.bind(this)
    )
    this.$canvasView.removeEventListener('mouseout', this.onTouchEnd.bind(this))
    // Window
    this.$canvasView.removeEventListener(
      'wheel',
      this.onMouseWheel.bind(this),
      {
        passive: false
      }
    )
    window.addEventListener('resize', this.onResize.bind(this))
    this.hasEventListeners = false
  }

  destroy() {
    window.cancelAnimationFrame(this.animationLoop)
    this.removeEventListeners()
    this.batchLoader.destroy()
  }

  connectedCallback() {
    this._totalFrames = Number(this.getAttribute('totalFrames'))
    this.resizeCanvas(window.innerWidth)
  }

  resizeCanvas(width) {
    this.$canvasView.width = width
    this.$canvasView.height = (1080 / 1920) * width

    this.$canvasLoaderView.width = width
    this.$canvasLoaderView.height = (1080 / 1920) * width

    this.scale = this.$canvasView.height / 1080

    this.sliderBounds = {
      top: this.$ctx.canvas.height - 250 * this.scale,
      left: 300 * this.scale,
      width: this.$ctx.canvas.width - 600 * this.scale,
      height: 2
    }
    this._kThreshold = this.sliderBounds.width

    //    this._kThreshold = this.$canvasView.width

    if (this.isLoaded) {
      this._render()
    }

    if (this.hotspots) {
      this.hotspots.resizeCanvas(window.innerWidth)
    }
  }

  resetHotspotsClicked() {
    if (this.hotspots) {
      this.hotspots.resetHotspotsClicked()
    }
  }

  renderFirstFrameTheExit() {
    //   console.log('renderFirstFrameTheExit', this.$canvasLoaderView.classList);
    /*this.$ctxLoader.clearRect(
      0,
      0,
      this.$ctx.canvas.width,
      this.$ctx.canvas.height
    )*/
    this.$ctxLoader.drawImage(
      this.batchLoader.getImage(this._frameIndex),
      0,
      0,
      1920 * this.scale,
      1080 * this.scale
    )

    //this.$ctx.font = '100px serif';
    //this.$ctx.fillText(" PRELOADER", 500 * this.scale, 500 * this.scale);

    this.$canvasLoaderView.classList.add('active')

    setTimeout(function () {
      this.prerender()
      this.$canvasLoaderView.classList.remove('active')
      this.isLoading = false
      this._render()
    }, 1500)
  }

  _render() {
    this.$ctx.clearRect(0, 0, this.$ctx.canvas.width, this.$ctx.canvas.height)
    //   let img = this.batchLoader.getImage(this._frameIndex);
    // if(img){
    this.$ctx.drawImage(
      this.batchLoader.getImage(this._frameIndex),
      0,
      0,
      Math.round(1920 * this.scale),
      Math.round(1080 * this.scale)
    )
    //}
    /* 
    this.$ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    this.$ctx.font = '48px serif'
    // const str = ' this.isLoading  = ' + this.isLoading //this.folder+"/"+this.filename+"/["+this.filetype+"]["+this._speedX + "]";
    this.$ctx.fillText(this._frameIndex, 10, 50)
    console.log(this._frameIndex)
  */
    //this.$ctx.font = '100px serif'
    //this.$ctx.fillText(this._frameIndex, 500 * this.scale, 500 * this.scale)
    /*  
    this.$ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    this.$ctx.font = '48px serif'
    this.$ctx.fillText(
      this._frameIndex,
      this._virtualPoint.x - (50 * this.scale) / 2,
      140 * this.scale
    )
  */
  }

  static get observedAttributes() {
    return [
      'interactive',
      'totalFrames',
      'mousewheel',
      'frameindex',
      'filename',
      'folder',
      'filetype'
    ]
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return
    }
    switch (name) {
      case 'filename':
        this._filename = newValue
        break
      case 'folder':
        this._folder = newValue
        break
      case 'totalFrames':
        this._totalFrames = newValue
        break
      case 'filetype':
        this._filetype = newValue
        break
      case 'interactive':
        this._isInteractive = newValue
        break
      case 'mousewheel':
        this._mousewheel = newValue === true || newValue === 'true'
        break
      case 'frameindex':
        this._frameIndex = newValue
        if (this.isLoaded) {
          this.prerender()
        }
        break
    }

    // this.load();
  }

  /////////////////////////////////////////////
  // Event Handellers.
  next() {
    this._frameIndex++
    this._frameIndex =
      this._frameIndex >= this.totalFrames ? this.totalFrames : this._frameIndex
    this.prerender()
  }
  prev() {
    this._frameIndex--
    this._frameIndex = this._frameIndex <= 0 ? 0 : this._frameIndex
    this.prerender()
  }
  onResize() {
    this.resizeCanvas(window.innerWidth)
  }
  onTouchStart(e) {
    e.preventDefault()
    if (this.hotspots) {
      this.hotspots.onTouchStart(e)
    }
    if (
      this.isLoading ||
      this._isInteractive == 'false' ||
      this._isInteractive == false
    ) {
      return
    }
    this._previousPoint = PointerHelper.position(this.$canvasView, e)
    this.addMoveEvents()
  }

  onMouseWheel(event) {
    event.preventDefault()
    event.stopPropagation()
    if (event.deltaY > 0) {
      this.next()
    } else {
      this.prev()
    }
  }

  onTouchEnd() {
    this.removeMoveEvents()
    if (Math.abs(this._speedX) <= 3) {
      this.dispatchEvent(
        new CustomEvent('dragcomplete', {
          bubbles: true,
          detail: { frame: this._frameIndex }
        })
      )
    }
  }

  addMoveEvents() {
    if (this.isLoading) {
      return
    }
    window.cancelAnimationFrame(this.animationLoop)
    this.dispatchEvent(
      new CustomEvent('dragstart', {
        bubbles: true,
        detail: { frame: this._frameIndex }
      })
    )
    this.dragging = true
    this.$canvasView.addEventListener('touchmove', this.moveHandeller, {
      passive: true
    })
    this.$canvasView.addEventListener('mousemove', this.moveHandeller, {
      passive: true
    })
  }

  removeMoveEvents() {
    this.dragging = false
    this.$canvasView.removeEventListener('touchmove', this.moveHandeller, {
      passive: true
    })
    this.$canvasView.removeEventListener('mousemove', this.moveHandeller, {
      passive: true
    })
    if (Math.abs(this._speedX) > 5) {
      this.animationLoop = window.requestAnimationFrame(this.animateHandeller)
    }
  }

  onMoveEvent(e) {
    if (this.isLoading) {
      return
    }
    const point = PointerHelper.position(this.$canvasView, e)
    const diff = point.x - this._previousPoint.x
    this._speedX = this._direction === 1 ? diff : -diff
    this._previousPoint = point
    this.update()
    this.prerender()
  }

  /////////////////////////////////////////////
  // Animation
  update() {
    this._speedX *= this._kFriction
    this._virtualPoint.x += this._speedX
    this._virtualPoint.x = Math.ceil(
      this._virtualPoint.x > this._kThreshold
        ? this._kThreshold
        : this._virtualPoint.x
    )
    this._virtualPoint.x = Math.ceil(
      this._virtualPoint.x < 0 ? 0 : this._virtualPoint.x
    )
    this._frameIndex = Math.floor(
      (this._virtualPoint.x / this._kThreshold) * this.totalFrames
    )
  }

  animate() {
    if (this.isLoading) {
      return
    }

    this.update()
    if (Math.abs(this._speedX) <= 3) {
      this.dispatchEvent(
        new CustomEvent('dragcomplete', {
          bubbles: true,
          detail: { frame: this._frameIndex }
        })
      )
      window.cancelAnimationFrame(this.animationLoop)
    } else {
      this.animationLoop = window.requestAnimationFrame(this.animateHandeller)
    }

    this.prerender()
  }


  /////////////////////////////////////////////
  // Getters Setters.

  set filename(val) {
    this.setAttribute('filename', val)
  }

  get filename() {
    return this._filename
  }
  set totalFrames(val) {
    this.setAttribute('totalFrames', val)
  }

  get totalFrames() {
    return this._totalFrames
  }

  get frameIndex() {
    return this._frameIndex
  }

  set frameIndex(val) {
    this.setAttribute('frameindex', val)
  }

  set folder(val) {
    this.setAttribute('folder', val)
  }

  get folder() {
    return this._folder
  }

  set filetype(val) {
    this.setAttribute('filetype', val)
  }

  get filetype() {
    return this._filetype
  }

  set interactive(val) {
    this.setAttribute('interactive', val)
  }

  get interactive() {
    return this._isInteractive
  }
  set mousewheel(val) {
    this.setAttribute('mousewheel', val)
  }

  get mousewheel() {
    return this._mousewheel
  }
}
window.customElements.define('image-sequence', ImageSequence)
