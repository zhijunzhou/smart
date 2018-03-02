<template>
  <div id="app">
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
body {
  margin: 0;
}

* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.el-header,
.el-footer {
  /* background-color: #b3c0d1; */
  /* color: #333; */
  /* text-align: center; */
  /* line-height: 60px; */
}

.el-aside {
  /* background-color: #d3dce6; */
  /* color: #333; */
}

.el-main {
  /* background-color: #e9eef3; */
  /* color: #333; */
  /* text-align: center; */
  /* line-height: 160px; */
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.el-tabs__content {
  padding: 15px 15px;
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}
.echarts {
  width: 100% !important;
}
a {
  text-decoration: none;
}
.text-white {
  color: #fff;
}
.text-center {
  text-align: center;
}
.text-left {
  text-align: left;
}
.text-right {
  text-align: right;
}
</style>
