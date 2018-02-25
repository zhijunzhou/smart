<template>
  <el-container>
    <el-header>Header</el-header>
    <el-main>
      <figure>
        <chart 
          :options="bar"
          :init-options="initOptions"
          ref="bar"
          theme="ovilia-green"
          auto-resize
        />
      </figure>
      <div>
        <el-button>扫描登陆</el-button>
      </div>
      <el-row>
        <el-col :span="12">
          <div class="grid-content">
            <div id="login_container"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <div id="login_container2"></div>
          </div>
          </el-col>
      </el-row>
    </el-main>
    <el-footer>Footer</el-footer>
  </el-container>
</template>

<script>

import 'echarts/lib/chart/line'
// import 'echarts/lib/chart/bar'
import getBar from '@/data/bar'

export default {
  data () {
    return {
      bar: getBar(),
      initOptions: {
        renderer: 'canvas'
      }
    }
  },
  mounted () {
    /* eslint-disable no-undef */
    const obj = new WxLogin({
      id: 'login_container',
      appid: 'wxbdc5610cc59c1631',
      scope: 'snsapi_login',
      redirect_uri: encodeURIComponent('https://passport.yhd.com/wechat/login.do'),
      state: Math.random().toString(36).substr(2, 15),
      style: 'black',
      href: ''
    })

    const obj2 = new WxLogin({
      id: 'login_container2',
      appid: 'wxd97ecfda77d6b9ae',
      scope: 'snsapi_login',
      redirect_uri: encodeURIComponent('http://www.starstech.cc/smart'),
      state: Math.random().toString(36).substr(2, 15),
      style: 'black',
      href: ''
    })

    console.log(obj, obj2)
  }
}
</script>

<style>

.echarts {
  height: 300px;
}
.el-header,
.el-footer {
  /* background-color: #b3c0d1; */
  /* color: #333; */
  text-align: center;
  line-height: 60px;
}

.el-aside {
  /* background-color: #d3dce6; */
  /* color: #333; */
  text-align: center;
  line-height: 200px;
}

.el-main {
  /* background-color: #e9eef3; */
  /* color: #333; */
  text-align: center;
  line-height: 160px;
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


