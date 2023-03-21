<template>
  <svg
      :width="circleBorderActive && activeItem ? width + circleBorderWidth : width"
      :height="height">
    <circle
        v-if="activeItem && circleBorderActive"
        :cx="(width/2)+(circleBorderWidth/2)"
        :cy="height/2"
        :r="width/2"
        :stroke="circleBorderColor"
        :stroke-width="circleBorderWidth"
        :fill="fill"
    />
    <circle
        v-else
        :cx="width/2"
        :cy="height/2"
        :r="width/2"
        :stroke="circleBorderColor"
        :stroke-width="border ? circleBorderWidth : 0"
        :fill="fill"
    />
    Sorry, your browser does not support inline SVG.
  </svg>
</template>
<script>
export default {
  name: 'ukscc-Interior',
  props: {
    width: {
      type: Number,
      required: false,
      default: 10
    },
    fill: {
      type: String,
      required: false,
      default: '#ffffff'
    },
    border: {
      type: Boolean,
      required: false,
      default: true
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
    activeItem: {
      default:false,
      required:false,
      type:Boolean
    }
  },

  computed: {
    height: {
      get() {
        return (this.width / 10) * 16
      }
    }
  }
}
</script>
<style>
g {
  transition: 0.5s;
}
</style>
