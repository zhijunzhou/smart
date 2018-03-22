<template>
  <div>
    <div class="mask"></div>
    <div class="loading">
      <div class="loader-inner">
        <div><i class="el-icon-loading"></i></div>
        <div>Loading..</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../assets/css/function";

.mask {
    position: fixed;
    width: 100%;
    margin: 0 auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.7);
  }

.loading {
  position: fixed;
  top: 50%;
  left: 50%;
  height:30%;
  padding:20px;
  text-align:center;
  color:#fff;
  transform: translate(-50%, -50%);
  z-index: 101;
  .loader-inner {
    width: px2rem(280px);
    height: px2rem(280px);
    position: absolute;
    z-index: 1002;
  }
}
</style>