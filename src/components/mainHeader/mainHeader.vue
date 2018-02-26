<template>
  <div>
    
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: 'SMART'
    }
  }
}
</script>

<style scoped>
header::after {
  display: inline-block;
  content: "";
  height: 100%;
  vertical-align: middle;
}
.el-header {
    padding: 0 20px;
    box-sizing: border-box;
}
.header-logo {
  display: inline-block;
  vertical-align: middle;
}
.header-operations {
	display: inline-block;
	float: right;
	padding-right: 30px;
	height: 100%;
}

.header-operations li {
	color: #fff;
	display: inline-block;
	vertical-align: middle;
	padding: 0 10px;
	margin: 0 10px;
	line-height: 80px;
	cursor: pointer;
}

.header-operations li:last-child {
	cursor: default;
}

.header-operations span {
	opacity: 0.7;
}

.header-operations::after {
	display: inline-block;
	content: "";
	height: 100%;
	vertical-align: middle;
}
</style>




