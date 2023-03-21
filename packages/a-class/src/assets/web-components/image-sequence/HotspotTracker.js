/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
import PointerHelper from './PointerHelper.js'

function HotspotTracker(_pano, options) {
  //  console.log('HotspotTracker', options)
  const pano = _pano

  // is dubug mode on
  const debugMode = options._debugMode ? options._debugMode : true

  // calback function
  const callback = options._callback

  // initail scale.
  let scale = options._origionalSize.width / options._size.width

  // scope fixer
  // scope fixer
  const totalFrames = 36 //options._totalFrames;

  // Current Frame
  let frame = 0

  const xoffset = options.offset || 0

  // container for the canvas
  //const container = options._container;

  // size of the container.
  //const size = options._size;

  // size of the container.
  const origionalSize = options._origionalSize

  // stroke color
  //const color = options.color ? options.color : "#00adef";

  // the hotspot circle radius
  const hotspotRadius = 40

  // hotspots data
  this.data = options.data

  // the canvas
  this.canvas = options.canvas

  // the contecxt.
  this.ctx = this.canvas.getContext('2d')

  // array of current hotapots;
  this.currentHotspots = []

  ///////////////////////////////////
  // Test Code...
  // for simulating hotspots with dive to make them more accessible.
  function imageLoaded() {
    this.loaded = true
    let alloaded = true
    for (const img in hotspotImage) {
      // eslint-disable-next-line no-prototype-builtins
      if (hotspotImage.hasOwnProperty(img)) {
        const element = hotspotImage[img]
        if (!element.loaded) {
          alloaded = false
          return
        }
      }
    }
    this.update()
  }

  const hiliteIndex = 0.2
  const doClear = false
  const hotspotImage = {}
  /*
  hotspotImage['viewed'] = new Image()
  hotspotImage['viewed'].loaded = false
  hotspotImage['viewed'].id = 'viewed'
  hotspotImage['viewed'].src = 'assets/images/ui/hotspot-viewed.png'
  hotspotImage['viewed'].onload = imageLoaded
*/
  hotspotImage['blue'] = new Image()
  hotspotImage['blue'].laoded = false
  hotspotImage['blue'].id = 'blue'
  hotspotImage['blue'].src = 'assets/images/ui/hotspot-blue.png'
  hotspotImage['blue'].onload = imageLoaded

  hotspotImage['blue-active'] = new Image()
  hotspotImage['blue-active'].loaded = false
  hotspotImage['blue-active'].id = 'blue-active'
  hotspotImage['blue-active'].src = 'assets/images/ui/hotspot-blue-active.png'
  hotspotImage['blue-active'].onload = imageLoaded

  /*
    hotspotImage['inside'] = new Image();
    hotspotImage['inside'].id = 'inside';
    hotspotImage['inside'].src = "assets/images/ui/hotspot_inside.png";


    hotspotImage['default'] = new Image();
    hotspotImage['default'].id = 'default';
    hotspotImage['default'].src = "assets/images/ui/hotspot_empty.png";

    hotspotImage['black'] = new Image();
    hotspotImage['black'].id = 'default';
    hotspotImage['black'].src = "assets/images/ui/hotspot_black.png";

    hotspotImage['lock'] = new Image();
    hotspotImage['lock'].id = 'default';
    hotspotImage['lock'].src = "assets/images/ui/hotspot_lock.png";
    */
  ////////////////////////////////////

  // Load the data and callback... todo callback
  this.init = function () {
    //    this.loadData(jsonURL);
    this.initCanvas()
    this.resetHotspotsClicked()
  }

  this.resetHotspotsClicked = function () {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i].viewed = false
    }
    this.update()
  }
  // handle new frame changes
  this.onFrameChanged = function (_frame) {
    if (frame == _frame) return
    frame = _frame
    if (this.data.length > 0) {
      this.renderHotspots(this.getDataForFrame(frame, totalFrames + 1))
    }
  }

  /// Return  an object for the data for this frame.
  this.getDataForFrame = function (frame, t) {
    this.currentHotspots = []
    const hotspotsArray = []
    let pointlbl, fontSize

    // to measure the textsize
    this.ctx.font = 38 / scale + 'px Arial'

    for (let j = 0; j < this.data.length; j++) {
      const o = this.data[j]
      let cf // used as normalised frame comparison
      const points = o.positions[0]
      let hasViewed = false
      for (let l = 0; l < points.length; l++) {
        const rtn = {
          frame: frame,
          hotspots: []
        }

        hasViewed = o.viewed == true

        cf = (l + o.startFrame) % t // gets the offset frame.
        pointlbl = o.content.title //[Controller.lang];
        fontSize = (pointlbl.length > 2 ? 15 : 28) / scale
        this.ctx.font = fontSize + 'px Arial'
        if (cf == frame) {
          let alpha = 1

          if (o.useAlpha == true) {
            alpha = (l / (points.length / 2)) * 1
            alpha = Math.abs(alpha > 1 ? 2 - alpha : alpha)
          }
          // console.log(o);
          let icon = o.icon || 'default'
          icon = frame % 2 == 1 ? 'blue' : 'blue-active'

          const obj = {
            length: points.length,
            frameOffset: l,
            //var l = 10, f = 6; ( (f/ (l/2)) * 1 )
            alpha: alpha,
            textWidth: this.ctx.measureText(pointlbl).width,
            textHeight: 38,
            content: o.content,
            pos: [],
            selected: false,
            icon: icon,
            direction: o.direction,
            uselines: o.uselines
          }

          // console.log(obj.alpha);
          const str = ''
          for (let m = 0; m < o.positions.length; m++) {
            const po = {
              x: Number(o.positions[m][l].x) - xoffset,
              y: points[l].y
            }
            obj.pos.push(po)
          }
          rtn.hotspots.push(obj)
          hotspotsArray.push(rtn)
        }
      }
    }

    this.currentHotspots = hotspotsArray

    //  console.log(hotspotsArray);

    return hotspotsArray
  }

  // checks if the mouse is within any of the hotspots
  this.checkIfClickedHotspot = function (e) {
    const mouse = PointerHelper.position(this.canvas, e)
    const mousePoint = { x: mouse.x * scale, y: mouse.y * scale }
    // console.log(mouse, mousePoint)
    for (let i = 0; i < this.currentHotspots.length; i++) {
      for (let k = 0; k < this.currentHotspots[i].hotspots.length; k++) {
        const item = this.currentHotspots[i].hotspots[k]
        let shapePoint
        let _x, _y
        for (let j = 0; j < item.pos.length; j++) {
          _x = Number(item.pos[j].x * scale) // we need to subtract the width / 2 from this.
          _y = Number(item.pos[j].y * scale) // we need to subtract the height / 2 from this.
          shapePoint = { x: _x, y: _y }
          if (
            this.isCursorWithinCircle(
              shapePoint,
              mousePoint,
              hotspotRadius * scale
            )
          ) {
            this.setViewed(this.currentHotspots[i].hotspots[0].content)
            this.hotspotClickedCallback(
              this.currentHotspots[i].hotspots[0].content
            )
            this.update()
            return
          }
        }
      }
    }
  }

  this.setViewed = function (item) {
    for (let i = 0; i < this.data.length; i++) {
      if (item.id === this.data[i].content.id) {
        this.data[i].viewed = true
      }
    }
  }
  // Detected whether a point is within a circke.
  this.isCursorWithinCircle = function (shapePoint, mousePoint, r) {
    /*
        this.ctx.beginPath();
        this.ctx.arc(shapePoint.x, shapePoint.y, r, 0, 2 * Math.PI);
        this.ctx.stroke();
*/
    const distSqr =
      Math.pow(shapePoint.x - mousePoint.x, 2) +
      Math.pow(shapePoint.y - mousePoint.y, 2)
    if (distSqr < r * r) {
      return true
    }
    return false
  }

  // calculated the distance between two points
  this.lineDistance = function (point1, point2) {
    let xs = 0
    let ys = 0

    xs = point2.x - point1.x
    xs = xs * xs

    ys = point2.y - point1.y
    ys = ys * ys

    return Math.sqrt(xs + ys)
  }

  let strDebugCount = 0
  let strDebug = ''
  const points = []
  ;(this.onTouchStart = function (e) {
    //console.log('debugMode = ', debugMode );
    // e.preventDefault();
    this.checkIfClickedHotspot(e)
    const mouse = PointerHelper.position(this.canvas, e)
    if (debugMode) {
      strDebugCount++
      strDebug =
        strDebug +
        '{ "x": ' +
        Math.round(mouse.x) +
        ',"y":' +
        Math.round(mouse.y) +
        '},'
      console.log(
        'Frame = ',
        pano.frameIndex - strDebugCount + 1,
        '\n',
        strDebug
      )
      pano.next()
    }
  }),
    (this.onKeyDown = function (e) {
      if (e.key == 'c') {
        // left
        strDebug = ''
        strDebugCount = 0
        console.log('CLEAR')
        //  console.clear();
      }
      if (e.key == 'ArrowRight') {
        pano.next()
      }
      if (e.key == 'ArrowLeft') {
        pano.prev()
      }
    })

  this.initCanvas = function () {
    this.ctx = this.canvas.getContext('2d')
    this.ctx.mozImageSmoothingEnabled = true
    this.ctx.webkitImageSmoothingEnabled = true
    // add the canvas to the container.
    window.addEventListener('keydown', this.onKeyDown.bind(this), {
      passive: true
    })
    //  this.canvas.addEventListener('click', this.onTouchStart.bind(this), {passive:true} );
  }

  this.resizeCanvas = function (width) {
    this.canvas.width = width
    this.canvas.height = (1080 / 1920) * width
    scale = this.canvas.height / 1080

    //   console.log(scale);
  }
  this.update = function () {
    this.renderHotspots(this.getDataForFrame(frame, totalFrames + 1))
  }
  this.renderHotspots = function (dataItems) {
    const iconPoint = { x: 0, y: 0 }
    let iconPointOffsetX = 0

    let direction = 0
    // clear the content.
    this.clear()

    // if (debugMode) return;
    // make sure we have hotspots for this frame.
    if (dataItems.length > 0) {
      let hotspotsArray
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 1)'

      for (let j = 0; j < dataItems.length; j++) {
        let isSelectedHotspot = (isSelectedHotspot =
          j == hiliteIndex && doClear == true)
        hotspotsArray = dataItems[j]
        this.ctx.globalAlpha = hotspotsArray.hotspots[0].alpha
        // loop through each hotspot.
        for (let i = 0; i < hotspotsArray.hotspots[0].pos.length; i++) {
          direction = hotspotsArray.hotspots[0].direction

          this.ctx.restore()
          const point = hotspotsArray.hotspots[0].pos[i]
          point.x = point.x * scale
          point.y = point.y * scale

          iconPoint.x = point.x
          iconPoint.y = point.y

          // Draw them with lines.
          if (hotspotsArray.hotspots[0].uselines) {
            if (direction == 1) {
              iconPoint.x = point.x + 150 * scale //(point.x > size.width / 2) ? point.x - 150 : point.x + 150;
              iconPoint.y = point.y - 150 * scale //(direction == 1) ? point.y - 150 : point.y + 150;
              iconPointOffsetX = 0 * scale
            } else {
              iconPoint.x = point.x - 150 * scale //(point.x > size.width / 2) ? point.x - 150 : point.x + 150;
              iconPoint.y = point.y + 150 * scale //(direction == 1) ? point.y - 150 : point.y + 150;
              iconPointOffsetX = -0 * scale
            }

            // draw the line
            this.ctx.beginPath()
            this.ctx.lineWidth = 2 //1/scale;
            this.ctx.moveTo(point.x, point.y)
            this.ctx.lineTo(iconPoint.x, iconPoint.y)

            this.ctx.lineTo(iconPoint.x + iconPointOffsetX / 3, iconPoint.y)

            //this.ctx.closePath();
            this.ctx.stroke()

            // draw the circle at the point
            this.ctx.fillStyle = 'rgba(255, 255, 255, 1)'
            this.ctx.beginPath()
            this.ctx.arc(
              point.x,
              point.y,
              (hotspotRadius / 4) * scale,
              0,
              2 * Math.PI
            )
            this.ctx.fill()
          }

          // draw the icon.
          const icon = hotspotImage[hotspotsArray.hotspots[0].icon]
          this.ctx.drawImage(
            isSelectedHotspot ? icon : icon,
            iconPointOffsetX + iconPoint.x - (icon.width * scale) / 2,
            iconPoint.y - (icon.height * scale) / 2,
            icon.width * scale,
            icon.height * scale
          )

          /*
                    ///
                    var pointlbl = hotspotsArray.hotspots[0].content.title;
                    var fontSize = ((pointlbl.length > 2) ? 24 : 28) * scale;
                    var textSize = this.ctx.measureText(pointlbl);

                     var copySplit = pointlbl.split("<br>");

                    this.ctx.font = fontSize + "px daimler_csregular";
                    this.ctx.fillStyle = "#FFFFFF";
                    
                    // As we are spliting the text we may need to align right.
                    var longest = 0;
                    for(var k = 0; k< copySplit.length; k++){
                        var w = this.ctx.measureText(copySplit[k]).width;
                        longest = (w>longest)?w:longest;
                    }

                    var __y=0, __x=0;
                     for( k = 1; k< copySplit.length+1; k++){
                        
                        if( direction == 1 ){
                            __x =  (iconPointOffsetX + iconPoint.x + (icon.width * scale) + 10);
                           // __y =  ((iconPoint.y - (icon.width * scale) )* scale) + ((38 * k ));
                            __y =  iconPoint.y;
                        }else{

                            __x =  (iconPointOffsetX + iconPoint.x ) - longest - (icon.width * scale) ;
                          //  __y =  ((iconPoint.y - (icon.width * scale) )* scale) + ((38 * k ));
                          __y =  iconPoint.y;
                        }


                       // this.ctx.fillText(copySplit[k-1], __x-40, __y +60);
                        this.ctx.fillText(copySplit[k-1], __x-40, __y );

                              

                        }
//                    this.ctx.fillText(pointlbl, (point.x - ((icon.width / scale) / 2)) - (textSize.width / 2), iconPoint.y + (fontSize / 2) + spotOn.height);

*/
        }
      }
    } //if..
  }

  this.hotspotClickedCallback = function (hotspot) {
    if (callback) {
      callback(hotspot)
    }
  }

  this.clear = function () {
    const w = this.canvas.width
    const h = this.canvas.height
    this.ctx.clearRect(0, 0, w, h)
  }

  this.onResize = function (_x, _y, _width, _height) {
    this.canvas.width = _width
    this.canvas.height = _height
    this.canvas.style.top = _y + 'px'
    this.canvas.style.left = _x + 'px'

    scale = origionalSize.width / _width

    if (this.data.length > 0) {
      this.renderHotspots(this.getDataForFrame(frame, totalFrames))
    }
  }
  /*
    this.getMousePosition=function(event){
      var mouse={},e;
      if(event.originalEvent.targetTouches){
        e = event.originalEvent.targetTouches[0]
         var rect = this.canvas.getBoundingClientRect();
            mouse.offsetX = e.clientX- rect.left;
            mouse.offsetY = e.clientY- rect.top;
            
       }else{
            e = event;
            mouse.offsetX = e.offsetX;
            mouse.offsetY = e.offsetY;
       }
        return mouse;
    }
    */

  this.init()

  return this
}

export default HotspotTracker
