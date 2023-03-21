<template>
  <div class="carConfigurator">
    <div class="carConfigurator__container">
      <transition name="fade">
        <div class="message-container" v-show="showMessage">
          <Message :title="$appData.eqs['section-car-configurator'].title" />
        </div>
      </transition>
      <transition name="fade">
        <div
            class="ui"
            v-show="showUIButton"
        >
          <div class="ui-controls">
            <SwatchPicker
                ref="colorPicker"
                :data="modelColors"
                :color=true
                :circleSize=19
                fill="#4f4f4f"
                fillOpen="#000000"
                :circleBorder=false
                :circleBorderActive=true
                :circleBorderWidth=5
                :circleBorderColor="'rgba(0,0,0,0.5)'"
                :colorActif="color"
                @colorSelected="changeColor"
            />
            <div v-click-outside="onClickOutside">
              <div class="models-controls" 
              v-if="toggled"
              :class="{ active:isModelControlsActive, inactive: (!isModelControlsActive && toggled) }">
                  <ul>
                    <li v-for="(model, index) in allModels" :key="index" @click="changeModel(model, index)"
                    class="model-item" :class="{active: modelActif == index}">
                      {{ $appData.carConfiguratorsModels[index].name }}
                    </li>
                  </ul>
              </div>
              <button class="btn btnLight" @click="toggleModelControls">{{$appData.ui.model}}</button>
            </div>

            <button class="btn btnDark" @click="viewOffer">
                {{$appData.ui.viewOffers}}
            </button>
            <div class="container-angle-button">
              <button 
                class="btn btnLight btnAngle"
                :class="{active: angleActif == index}"
                v-for="(angle, index) in $appData.carConfiguratorsAngles" 
                :key="index"
                @click="changeAngle(angle, index)">
                  <img v-if="angleActif == index" :src="'../../images/configurator/icons/' + angle.active" class="car-icon" :class="angle.label"/>
                  <img v-if="angleActif != index" :src="'../../images/configurator/icons/' + angle.inactive" class="car-icon" :class="angle.label"/>
                </button>
            </div>
          </div>
        </div>
      </transition>
      <div>
        <canvas id="car-configurator"
                :class="{
                    'canvas-config':!showMessage && $isMobile(),
                    'canvas-config-ipad': $isIpad()}">
        </canvas>
      </div>
    </div>
  </div>
</template>

<script>
import Message from './Message.vue'
import SwatchPicker from './SwatchPicker/index.vue'
import clickOutside from '@/directives/clickOutside'

export default {
  name: 'ukscc-CarConfigurator',
  directives: {
    'click-outside': clickOutside
  },
  components: {
    Message,
    SwatchPicker
  },
 data() {
    return {
      showMessage:false,
      isModelControlsActive:false,
      progress:0,
      frames:[],
      allModels : [],
      allColorsModel : [],
      angle: null,
      model: null,
      color: null,
      image: null,
      context: null,
      canvas: null,
      modelActif: 0,
      angleActif: 0,
      toggled: false,
      linkOffer: null
    }
 },
  beforeMount() {
    this.angle = this.$appData.carConfiguratorsAngles[0]
    this.allModels = Object.keys(this.$appData.carConfigurators)
    this.model = this.allModels[0]
    this.color = this.$appData.carConfigurators[this.model][0].label
    this.linkOffer = this.$appData.carConfigurators[this.model][0].offerLink
    this.loadAllColorByCurrentModel()    
  },
  mounted() {
    this.canvas = document.getElementById('car-configurator')
    this.canvas.width = 1800;
    this.canvas.height = 700;
    this.context = this.canvas.getContext("2d");
    this.loadAllImages()
    this.image = this.loadImageFromCache(this.model, this.color, this.angle.label)
    this.image.onload = this.render
  },
  watch: {
    showMessage: function() {
      const isShowing = this.progress > 0 && this.progress < 0.5
      if (isShowing) this.toggled = false
      return isShowing
    },
    image: function(val) {
       this.render()
    },
    model: function() {
      this.image = this.loadImageFromCache(this.model, this.color, this.angle.label)
    },
    angle: function() {
      this.image = this.loadImageFromCache(this.model, this.color, this.angle.label)
    },
    color: function() {
      this.image = this.loadImageFromCache(this.model, this.color, this.angle.label)

    }
  }
  ,
  computed: {
    
    showUIButton() {
      return this.progress > 0.5
    },
    modelColors() {
      return  this.$appData.carConfigurators[this.model]
    }
  },
  methods : {
    render: function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.drawImage(this.image, -50, -200);
    },
    loadImageFromCache: function(model, color, angle) {
      if(this.frames[model+'_'+color+'_'+angle] === undefined) {
        this.loadImage(model, color, angle)
      }
      return this.frames[model+'_'+color+'_'+angle]
    },
    loadImage : function(model, color, angle) {
        const img = new Image();
        img.src = '../../images/configurator/'+model+'/'+angle+'-'+color+'.png';
        this.frames[model+'_'+color+'_'+angle] = img
    },
    loadAllImages: function() {
      this.allModels.forEach((model) => {
        const colorsObject =  this.$appData.carConfigurators[model]
        colorsObject.forEach((colorObject) => {
          this.$appData.carConfiguratorsAngles.forEach((angle) => {
            this.loadImage(model, colorObject.label, angle.label)
          })
        })
      })
    },
    loadAllColorByCurrentModel: function() {
      this.allColorsModel = this.$appData.carConfigurators[this.model].map((colorObject) => {
        return colorObject.label
      })
      if (this.$refs['colorPicker']) this.$refs['colorPicker'].swatchCode = this.color
    },
    changeColor: function(label) {
      this.color = label
      this.updateOfferLink()
    },
    changeAngle: function(angle, index) {
      this.angle = angle
      this.angleActif = index
    },
    changeModel: function(model, index) {
      this.model = model
      this.modelActif = index
      this.loadAllColorByCurrentModel()
      if(!this.allColorsModel.includes(this.color)) {
        this.color = this.allColorsModel[0];
      }
      this.updateOfferLink()
    },
    toggleModelControls: function() {
      this.toggled = true
      this.isModelControlsActive = !this.isModelControlsActive
    },
    viewOffer: function() {
      window.open(this.linkOffer)
    },
    onClickOutside: function(event) {
      const classSelected = event.target.className;
      const acceptedClasses = ["pinned-elements","car-icon side", "car-icon back", "car-icon front", "btn btnDark"];
      if (acceptedClasses.includes(classSelected) && this.toggled) {
        this.isModelControlsActive = false;
      }
    },
    updateOfferLink: function() {
      let indice = this.$appData.carConfigurators[this.model].findIndex(element => element.label == this.color)
      this.linkOffer = this.$appData.carConfigurators[this.model][indice].offerLink
    }
  }
}
</script>

<style lang="scss">
.carConfigurator {
  position: relative;
  left: 0;
  top: 0;
  min-height: 100vh;
  overflow: hidden;
  min-width: 100vw;
  pointer-events: none;
  .carConfigurator__container {
    display: flex;
    flex-direction: row;
    align-content: center;
    height: 100vh;
    background: rgb(224,230,228);
    background: linear-gradient(180deg, rgba(224,230,228,1) 63%, rgba(230,236,234,1) 63%);
    @include desktopDevice {
      background: rgb(219,227,229);
      background: linear-gradient(180deg, rgba(219,227,229,1) 55%, rgba(228,234,232,1) 55%, rgba(216,225,227,1) 85%, rgba(184,202,210,1) 87%, rgba(149,177,191,1) 88%);
    }

    .message-container {
      position:absolute;
      top:18vh;
      left:0px;
      display: flex;
      width: 100vw;
      .message {
        align-self: center;
        margin: auto ;
      }
      .cta {
        margin: auto;
        &.cta--personal {
          @include mobile-small-landscape() {
            margin: 0;
          }
        }
        .btn {
          padding: 4px 10px;
          margin: 10px 10px;
          @include desktopDevice() {
            padding: 4px 20px;
          }
          @include mobile-small-landscape() {
            padding: 0 10px;
          }
        }
      }
    }
  }
  .ui {
    position: absolute;
    bottom: 20px;
    &.ui--offsetY {
      bottom: 13px;
      left: 190px;
    }
    left: 0px;
    z-index: 3;
    display: flex;
    align-items: flex-end;
    width: 100%;
    margin-left: 20px;
    @include desktopDevice() {
      margin-left: 0px;
    }
    pointer-events: none;
    .ui-controls {
      display: flex;
      align-items: flex-end;
      margin-right: auto;
      margin-left: 20px;
    }
    .btn {
      border: 2px solid #323232 !important;
    }
    .cta {
      margin-left: auto;
      pointer-events: all;
      .btn {
        margin-right: 40px;
        @include mobile-portrait() {
          margin-right: 20px;
        }
      }
    }
  }
  .colorPicker {
    background: rgba(204, 204, 204, 0.8) !important;
    .toggle-button {
      height: 33px !important;
    }
  }
  canvas {
    width:100vw;
    height:auto;
    position: absolute;
    top:18vh;
    left:0vw;
    margin-left:auto;
    background:transparent;
    transition: all 0.5s;
    @include desktopDevice() {
      width:80vw;
      left:10vw;
      top:19vh;
    }
  }

  .canvas-config {
    top:6vh;
  }

  .canvas-config-ipad {
    top: 0;
    bottom: 0;
    margin: auto 0;
    transition: all 0s;
  }

  .container-angle-button {
    position: fixed;
    top: 25vh;
    right:2vw;
    display:flex;
    flex-direction: column;
    @include desktopDevice() {
      position:relative;
      top:0;
      left:0;
      display:block;

    }

    .btn {
      margin-right:0px !important;
      margin-left:auto !important;
      margin-bottom: 10px !important;
      transition: all 0.3s;
      @include desktopDevice() {
        margin-right:10px !important;
        margin-bottom:0px !important;
      }

    }
  }

  .models-controls {
    position: absolute;
    bottom: 45px;
    border: 2px solid #323232 !important;
    cursor: pointer !important;
    z-index:10;
    pointer-events: auto;
    ul {
      list-style-type:none!important;
      margin:0px !important;
      padding:0px!important;
      li {
        padding: 10px 25px;
        text-align: left;
        cursor: pointer !important;
        background:rgba(204, 204, 204, 0.8);
        transition: all 0.3s;
      }
    }
  }
  .models-controls.active {
    display: block;
    animation: showing 0.5s linear;
  }
  .models-controls.inactive {
    animation: hiding 0.5s forwards;
  }
  .arrow-down {
    width: 0; 
    height: 0; 
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 20px solid #f00;
  }
}

.models-controls li:hover, 
.btnAngle:hover {
  background: #323232  !important;
  color: #fff !important;
}

.models-controls li.active, 
.btnAngle.active {
  background: #000000  !important;
  color: #fff !important;
}

img.car-icon {
    height: 24px;
}

@keyframes showing {
  0% {
    opacity: 0
  }

  100% {
    opacity: 1
  }
}

@keyframes hiding {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

</style>
