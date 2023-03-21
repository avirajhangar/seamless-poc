<template>
  <div class="main">
    <div class="detail title">
      <h1>{{ $appData.ui['exterior-features'] }}</h1>
    </div>

    <div
      class="detail"
      v-for="(item, index) in data.exterior"
      :key="index + item.id"
    >
      <Detail :visible="true" :detail="item" />

      <!-- -->
    </div>

    <div class="detail title">
      <h1>{{ $appData.ui['interior-features'] }}</h1>
    </div>
    <div class="detail" v-for="item in data.hotspots" :key="item.id">
      <Detail :visible="true" :detail="item" />
    </div>
  </div>
</template>

<script>
import Detail from '@/components/Detail.vue'

export default {
  name: 'ukscc-Data',
  components: {
    Detail
  },
  data() {
    return {
      data: this.$appData
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 100%;
  flex: 1 0 auto;
  flex-flow: column;
  display: flex;
  overflow-y: scroll;
  color: #000000;
  background: #ffffff;
  scroll-snap-type: y mandatory;
  .detail {
    position: relative;
    height: 50vh;
    min-height: 50vh;
    max-height: 50vh;
    margin-top: 5px;
    scroll-snap-align: start;

    &.title {
      display: flex;
      flex-flow: column;
      justify-content: center;
    }

    &.interior {
      min-height: 100vh;
    }
    &.full {
      min-height: 100vh;
    }
    &.exterior {
      background: #000000;
      display: flex;
      justify-content: center;
    }
    .detail-view {
      position: relative;
    }
  }
}
</style>
