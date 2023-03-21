<template>
  <div class="colorPicker" :class="{ closed: !isOpen, colorPickerCustom:color,borderTopNone: isOpen&&color }">
    <div class="toggle-button" @click.stop.prevent="toggleSwatches">
      <i>
        <InteriorIcon
            v-bind:active="isOpen"
            :width="circleSize"
            :fill="isOpen ? fillOpen : fill"
            :border="circleBorder"
        />
      </i>
    </div>
    <div class="colors" v-if="isOpen">
      <ul class="color-items" v-if="!color">
        <li
          v-for="(swatch, index) in this.data"
          :key="index"
          @click="onSelectSwatch(swatch.code)"
          class="swatch"
          :class="{ active: swatchCode === swatch.code }"
        >
          <img
            :src="'images/swatches/' + swatch.code + '.jpg'"
            width="100%"
            height="auto"
          />
        </li>
      </ul>
      <ul class="color-items" v-if="color && isOpen">
        <li
          v-for="(swatch, index) in this.data"
          :key="index"
          @click="onSelectSwatch(swatch.code)"
          class="swatch"
          :class="{ active: swatchCode === swatch.code }"
        >
          <img
            :src="'images/swatches/' + swatch.code + '.jpg'"
            width="100%"
            height="auto"
          />
        </li>
        <li
          v-for="(swatch, index) in this.data"
          @click="onSelectColor(swatch.label)"
          :key="index"
        >
          <i>
            <InteriorIcon
                :width="circleSize"
                :fill="swatch.colorHex"
                :border="circleBorder"
                :activeItem="swatchCode === swatch.label || swatch.label === colorActif"
                :circleBorderActive="circleBorderActive"
                :circleBorderWidth="circleBorderWidth"
                :circleBorderColor="circleBorderColor"
            />
          </i>

        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import InteriorIcon from '../icons/Interior.vue';

export default {
  name: 'ukscc-swatch',
  components: {
    InteriorIcon
  },
  props: {
    data: Array,
    color: {
      default: false,
      required: false,
      type: Boolean
    },
    circleSize: {
      default:22,
      required:false,
      type:Number
    },
    fill: {
      default:'#d8d8d8',
      required:false,
      type: String
    },
    circleBorder: {
      default: true,
      required:false,
      type:Boolean
    },
    circleBorderActive: {
      default:false,
      required:false,
      type:Boolean
    },
    circleBorderWidth: {
      default:1,
      required:false,
      type:Number
    },
    circleBorderColor: {
      default:'#000000',
      required:false,
      type:String
    },
    fillOpen: {
      default:'#00adef',
      required:false,
      type:String
    },
    colorActif: {
      default:'',
      required:false,
      type:String
    }
  },
  data() {
    return {
      isOpen: false,
      swatchCode: ''
    }
  },
  mounted() {
    this.swatchCode = this.data[0].code
  },
  methods: {
    toggleSwatches: function () {
      this.isOpen = !this.isOpen
      this.trackEvent({
        pageName: `modelpage.${this.$store.state.viewpoint}`,
        eventCategory: 'click',
        eventAction: 'bottom_nav',
        eventLabel: `upholstery.${this.isOpen ? 'open' : 'close'}`
      })
    },
    onSelectColor(label) {
      this.swatchCode = label
      this.$emit('colorSelected', label)
    },
    onSelectSwatch(code) {
      this.swatchCode = code
      this.$emit('swatchSelected', code)
      this.isOpen = false
      this.trackEvent('click', `CTA:upholstery:${code}`)
      this.trackEvent({
        pageName: `modelpage.${this.$store.state.viewpoint}`,
        eventCategory: 'click',
        eventAction: 'bottom_nav',
        eventLabel: `upholstery.${this.swatchCode}`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
$swatchSize-regular: 30px;

.colorPickerCustom {
  height: auto !important;
  overflow: visible !important;
  .colors {
    background: rgba(204, 204, 204, 0.8) !important;
    width:38px;
    border: 2px solid #323232;
    border-bottom:none !important;
    left:-2px;
    bottom:33px !important;
  }
}
.borderTopNone {
  border-top:none !important;
}
.colorPicker {
  position: relative;
  bottom: 0;
  left: 0px;
  width: 38px;
  display: flex;
  border: 2px solid #323232;
  overflow: hidden;
  //height: 38px;
  flex-wrap: wrap-reverse;
  margin-right: 10px;
  //transition: height 0.3s ease-in-out 0s;
  height: 121px;
  pointer-events: all;
  &.closed {
    pointer-events: none;
    //transition: height 0.3s ease-in 0.5s;
    height: 38px;
  }
  background-color: rgba(78, 78, 78, 0.8);

  .toggle-button {
    pointer-events: all;
    background-color: transparent;
    cursor: pointer;
    padding-left: 1px;
    display:flex;
    width: 38px;
    height: 36px;
    img {
      border-radius: 50%;
      border: solid 1px #363739;
      width: $swatchSize-regular;
    }
    i {
      margin:auto
    }
  }

  .colors {
    //height: 130px;
    position: absolute;
    bottom: 40px;
  }
  .color-items {
    margin-top: auto;
    align-items: center;
    justify-content: center;

    li {
      margin-top: auto;
      display: flex;
      margin-left: -37px;

      img,i {
        margin: 0 0 5px 0px;
        width: $swatchSize-regular;
        height: $swatchSize-regular;
        border-radius: 50%;
        transition: border 0.2s ease-out;
        border: solid 2px #ffffff69;
        transition-delay: 0s;
        transition: transform 0.5s ease-out;
        transition: border 0.3s ease-out;

      }
      i {
        border: none;
      }

      img {
        transform: scale(0.7);
      }
      cursor: pointer;
      &.active {
        transform: scale(1);
        img {
          border: solid 2px #00adef;
        }

      }
    }
  }
}
</style>
