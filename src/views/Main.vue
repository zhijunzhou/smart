<template>
  <el-container class="wrapper">
    <el-header
      height="60px"
      :style="{'background-color': primaryColor}">      
			<span class="header-logo">$</span>
			<!-- <span class="logo-txt">mart</span> -->
      <ul class="header-operations">    
				<li>
					<img :src="$store.state.userInfo.headimgurl" class="privateImage" v-if="$store.state.userInfo.headimgurl">
				</li>
				<li>
					<span>
						{{$store.state.userInfo.fullName}}
					</span>
				</li> 
        <li>
          <span>
						昵称: {{$store.state.userInfo.nickname}}
          </span>
				</li>
        <li>
					<router-link to="/">
						<span>
							退出
						</span>
					</router-link>
        </li>
      </ul>
		</el-header>
    <el-container>
      <el-aside class="menu">
        <el-menu
					:router="true"
					:defaultOpeneds="defaultOpeneds"
          default-active="1"
          active-text-color="#409EFF"
					class="el-menu-vertical-d">
					<el-submenu index="1">
							<template slot="title">
								<i class="el-icon-menu"></i>
								<span><b>工作管理</b></span>
							</template>
							<el-menu-item index="1-1" :route="{ path: '/main' }">提议</el-menu-item>
							<el-menu-item index="1-2" :route="{ path: '/main' }">待执行</el-menu-item>
							<el-menu-item index="1-3" :route="{ path: '/main' }">已执行</el-menu-item>
							<el-menu-item index="1-4" :route="{ path: '/main' }">已总结</el-menu-item>
							<el-menu-item index="1-5" :route="{ path: '/main' }">被拒绝提议</el-menu-item>
					</el-submenu>
          <!-- <el-menu-item index="1" :route="{ path: '/main' }">
            <i class="el-icon-menu"></i>
            <span>工作管理</span>
          </el-menu-item> -->
					<el-menu-item index="2" :route="{path: '/main/products'}">
						<i class="el-icon-location"></i>
						<span><b>产品列表</b></span>
					</el-menu-item>
          <el-menu-item index="3" :route="{ path: '/main/setting' }">
            <i class="el-icon-setting"></i>
            <span><b>用户管理</b></span>
					</el-menu-item>
					<el-submenu index="2">
							<template slot="title">
								<i class="el-icon-service"></i>
								<span><b>反馈列表</b></span>
							</template>
							<el-menu-item index="2-1" :route="{ path: '/main' }">反馈详情</el-menu-item>
							<el-menu-item index="2-2" :route="{ path: '/main' }">反馈统计</el-menu-item>
					</el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="content">
				<router-view></router-view>
      </el-main>
    </el-container>    
    <el-footer></el-footer>
  </el-container>
</template>

<script>
import mainHeader from '@/components/mainHeader/mainHeader'

export default {
  data () {
    return {
      primaryColor: '#409eff',
      defaultOpeneds: ['2']
    }
  },
  components: {
    mainHeader
  }
}
</script>

<style>
.menu {
  height: 100%;
}

.content {
  padding: 20px;
}

.privateImage{
	display:inline-block;
	border-radius:50%;
	height: 40px;
	vertical-align:middle;
}

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
.el-menu {
    border-right: 1px solid #e6e6e6;
    list-style: none;
    position: relative;
    margin: 0;
    padding-left: 0;
    background-color: #fff;
}
.el-menu-item {
    height: 56px;
    line-height: 56px;
    font-size: 14px;
    color: #303133;
    padding: 0 20px;
    list-style: none;
    cursor: pointer;
    position: relative;
    transition: border-color .3s,background-color .3s,color .3s;
    box-sizing: border-box;
    white-space: nowrap;
}
.el-menu-item:focus, .el-menu-item:hover {
    outline: none;
    background-color: #ecf5ff;
}
.el-menu-item.is-active {
    color: #409eff;
}
.header-logo {
	display: inline-block;
	vertical-align: middle;
	color: #fff;
	height: 40px;
	width: 40px;
	font-weight: 800;
	line-height: 40px;
	text-align: center;
	font-size: 30px;
	border-radius: 50%;
	background: #89b846;
}
.logo-txt {
	color: #fff;
	font-size: 22px;
	font-style: italic;
	font-weight: 600;
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
	/* margin: 0 10px; */
	line-height: 60px;
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

figure {
	display: inline-block;
	margin: 2em auto;
	border: 1px solid rgba(0,0,0,0.1);
	border-radius: 8px;
	box-shadow: 0 0 45px rgba(0,0,0,0.2);
	padding: 1.5em 2em;
}

figure .echarts {
	width: 40vw;
	min-width: 400px;
	height: 300px;
}

#logo {
	display: inline-block;
	width: 128px;
	height: 128px;
	pointer-events: none;
}

.modal {
	display: none;
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(0,0,0,0.2);
	z-index: 1;
}

.modal.open {
	display: block;
}

.modal img {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	max-width: 80vw;
	border: 2px solid #fff;
	border-radius: 3px;
	box-shadow: 0 0 30px rgba(0,0,0,0.2);
}

@media (min-width: 980px) {
	figure.half {
		padding: 1em 1.5em;
	}

	figure.half .echarts {
		width: 28vw;
		min-width: 240px;
		height: 180px;
	}

	figure.half:not(:last-child) {
		margin-right: 15px;
	}
}

@media (max-width: 980px) {
	p {
		display: flex;
		justify-content: center;
	}

	p select {
		text-indent: calc(50% - 1em);
	}

	p select,
  p label {
		border: 1px solid #4fc08d;
		border-radius: 2em;
		background-color: #fff;
		color: #42b983;
		cursor: pointer;
		transition: opacity 0.3s;
	}

	p button,
  p input,
  p select,
  p label {
		flex: 1 0;
		margin: 0 0.5em;
		padding: 0;
		line-height: 2.4em;
		max-width: 40vw;
		border-radius: 2px;
		font-size: 0.8em;
	}

	p select {
		-webkit-appearance: none;
	}

	p input[type="checkbox"] {
		display: none;
	}

	p input[type="checkbox"]:checked + label {
		background: #42b983;
		color: #fff;
	}

	figure {
		width: 100vw;
		margin: 1em auto;
		padding: 0 1em;
		border: none;
		border-radius: 0;
		box-shadow: none;
	}

	figure .echarts {
		width: 100%;
		min-width: 0;
		height: 75vw;
	}
}

.renderer {
	position: fixed;
	top: 10px;
	left: 10px;
	font-size: 12px;
	text-align: center;
}

.renderer button {
	float: left;
	position: relative;
	width: 48px;
	border-radius: 4px;
}

.renderer button.active {
	z-index: 1;
	background-color: #4fc08d;
	color: #fff;
}

.renderer button:first-child {
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
}

.renderer button:last-child {
	left: -1px;
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
}
</style>


