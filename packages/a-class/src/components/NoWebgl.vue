<template>
  <div class="NoWebgl">
    <div>
      {{ $appData.ui['unsupported-webgl'] }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ukscc-NoWebgl',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.NoWebgl {
  display: flex;
  color: #ffffff;
  height: 100%;
  justify-content: center;
  div {
    align-self: center;
  }
}
</style>
