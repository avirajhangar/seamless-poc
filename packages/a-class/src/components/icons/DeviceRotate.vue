<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 24.52 15.37"
  >
    <title>RotateDEvice</title>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_2-2" data-name="Layer 2">
        <path
          :fill="fill"
          class="cls-1"
          d="M7.6.49h-7A.64.64,0,0,0,0,1.13V14.74a.63.63,0,0,0,.63.63h7a.63.63,0,0,0,.63-.63V1.13A.64.64,
          0,0,0,7.6.49ZM4.12,15a.54.54,0,1,1,.53-.53A.54.54,0,0,1,4.12,15Zm3.6-2.09a.56.56,0,0,1-.56.56H1.07a.56
          .56,0,0,1-.56-.56V1.7a.56.56,0,0,1,.56-.56H7.16a.56.56,0,0,1,.56.56Z"
        />
        <path
          :fill="fill"
          class="cls-1"
          d="M23.89,7.14H10.28a.64.64,0,0,0-.64.64v7a.64.64,0,0,0,.64.63H23.89a.63.63,0,0,0,.63-.63v-7A.64.64
          ,0,0,0,23.89,7.14ZM10.55,11.79a.54.54,0,1,1,.53-.53A.53.53,0,0,1,10.55,11.79Zm13.32,2.52a.55.55,0,0,
          1-.55.55H12.1a.55.55,0,0,1-.55-.55V8.21a.55.55,0,0,1,.55-.55H23.32a.55.55,0,0,1,.55.55Z"
        />
        <path
          :fill="fill"
          class="cls-1"
          d="M13.87.57a4,4,0,0,1,4,4H16.71L18.13,6.1l1.42-1.56H18.41A4.53,4.53,0,0,0,10,2.15l.39.44A4,4,0,0,1,13.87.57Z"
        />
      </g>
    </g>
  </svg>
</template>
<script>
export default {
  name: 'ukscc-DeviceRotate',
  props: {
    width: {
      type: String,
      required: false,
      default: '24.52'
    },
    fill: {
      type: String,
      required: false,
      default: '#ffffff'
    }
  },
  computed: {
    height: {
      get() {
        return (this.width / 24) * 15.37
      }
    }
  }
}
</script>
