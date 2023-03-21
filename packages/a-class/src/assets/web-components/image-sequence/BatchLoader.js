/**
 * Batch Image Loader
 */
export default class BatchLoader {
  /**
   *
   * @param {Object} options
   * @param {function} progress - progress handeller.
   */
  constructor(options) {
    this.images = []
    this._onComplete = options.complete
    this._onProgress = options.progress
    this._filename = options.filename
    this._folder = options.folder
    this._filetype = options.filetype
    this._numberOfImages = options.frameIndeces.length //options.total;
    this._frameIndeces = options.frameIndeces
    this.load()
  }

  getImage(index) {
    index = index > this._numberOfImages - 1 ? this._numberOfImages - 1 : index
    return this.images[index].img
  }

  load() {
    for (let i = 0; i < this._numberOfImages; i++) {
      const index = this._frameIndeces[i]
      const number = index * 10
      //let n = number < 100 ? '0' + number : number
      //n = index == 0 ? '000' : n

      let n = index;
      // if (index < 10) {
      //   n = '0' + index
      // } else if (index < 100 && index > 9) {
      //   n = '' + index
      // } else {
      //   n = index
      // }
      this.images[i] = {
        filename: `${this._filename}${n}${this._filetype}`,
        loaded: false,
        img: null
      }

      // console.log(i, this.images[i]);

      this.loadImage(this._folder + this.images[i].filename)
        .then((img) => {
          this.images[i].loaded = true
          this.images[i].img = img
          const outstanding = this.images.filter(
            (image) => image.loaded === false
          ).length
          if (outstanding > 0) {
            this._onProgress(i, 1 - outstanding / this._numberOfImages)
          } else {
            this._onComplete()
          }
        })
        .catch((error) => console.error(error))
    }
  }

  loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.addEventListener('load', () => resolve(img))
      img.addEventListener('error', () => {
        reject(new Error(`Failed to load image's URL: ${url}`))
      })
      img.src = url
    })
  }

  isLoaded() {
    this.images.forEach(function (image) {
      if (image.loaded == false) {
        return false
      }
    })
  }

  destroy() {
    console.log('Batch Distroy')
  }
}
