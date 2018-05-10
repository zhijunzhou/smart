<template>
  <el-container class="wrapper">
		<el-header
			class="main-header"
			height="65px">      
			<el-row height="auto">
				<el-col :span="4">
					<img src="../assets/logo.png">
				</el-col>
				<el-col :span="6">
							<div class="main-title-cn">亿泰德内部销售系统  </div>
							<div class="main-title">{{date}}</div>
				</el-col>
				<el-col :span="8">
							<div class="main-title-en">Excellence  Leadership Teamwork Creative</div>
							<div class="main-title-en">Until you make peace with who you are, you will never be content with what you have.</div>
				</el-col>
			<!-- <span class="header-logo">$</span> -->
			<!-- <span class="logo-txt">mart</span> -->
			<el-col :span="6">
			<el-popover
				ref="userDetail"
				placement="top-start"
				title="用户信息"
				width="200"
				trigger="hover"
				>
				<el-card class="box-card">
					<div class="text item">
						工号: {{userInfo.userName}}
					</div>
					<div class="text item">
						姓名: {{userInfo.fullName}}
					</div>
					<div class="text item">
						邮件: {{userInfo.email}}
					</div>
					<div class="text item">
						电话: {{userInfo.phone}}
					</div>
					<div class="text item">
						角色: <span v-for="role in userInfo.roles">{{role.roleName}} &nbsp;</span>
					</div>
					<div class="text item">
						店铺: <span v-for="shop in userInfo.shops">{{shop.shopName}} &nbsp;</span>
					</div>
					<div slot="header" class="clearfix" v-if="userInfo.wechatId">
						<span>昵称: {{userInfo.wechatName}}</span>
						<el-button style="float: right; padding: 3px 0" type="text" @click="unbind(userInfo.userId)">微信解绑</el-button>
					</div>
				</el-card>
			</el-popover>
      <ul class="header-operations">    
				<li v-if="userInfo.wechatImage" v-popover:userDetail>
					<img :src="userInfo.wechatImage" class="privateImage">
				</li>
				<li v-else v-popover:userDetail>
					<span>
						{{userInfo.fullName}}
					</span>
				</li>
        <li>
						<el-button @click="logout" type="primary" plain>退出</el-button>
        </li>
			</ul>
			</el-col>
		</el-row>
		</el-header>
    <el-container>
      <el-aside class="menu" width="200">
        <el-menu
					:router="true"
					:defaultOpeneds="defaultOpeneds"
          default-active="1"
					active-text-color="#FF6600"
					class="el-menu-vertical-d">					
					<el-menu-item index="1" :route="{ path: '/main/setting' }" v-if="userInfo.userName==='admin'">
						<i class="el-icon-setting"></i>
						<span><b>用户管理</b></span>
					</el-menu-item>
					<el-menu-item index="5" :route="{ path: '/main/config' }" v-if="userInfo.userName==='admin'">
						<i class="el-icon-setting"></i>
						<span><b>系统设置</b></span>
					</el-menu-item>
					<el-submenu index="2" class="workflow-box">
						<template slot="title" >
								<el-menu-item index="2-0" :route="{ path: '/main/workflow' }" class="workflow-main">
									<i class="el-icon-message"></i>
									<span><b>工作管理</b></span>
								</el-menu-item>
								<!-- <el-menu-item> -->
									<!-- <span :class="{  submenuactive : index }">
										<i class="el-icon-menu"></i>
										<b>工作管理</b>
									</span> -->
								<!-- </el-menu-item> -->
						</template>
						<el-menu-item :index="work.index" :route="work.route" :key="work.index" v-for="work in workflow" @click="refresh">
								{{work.text}} <span class="work-count">({{work.count}})</span>
							<!-- <el-badge :value="work.count" class="suggestion-count">&nbsp;&nbsp;&nbsp;&nbsp;</el-badge> -->
						</el-menu-item>
          </el-submenu>
					<el-submenu index="3">
							<template slot="title">
								<i class="el-icon-location"></i>
								<span><b>订单统计</b></span>
							</template>
							<el-menu-item index="3-1" :route="{ path: '/main/products' }">销量报表</el-menu-item>
							<el-menu-item index="3-2" :route="{ path: '/main/orders' }">订单查询</el-menu-item>
					</el-submenu>
					<el-submenu index="4">
							<template slot="title">
								<i class="el-icon-service"></i>
								<span><b>反馈维护</b></span>
							</template>
							<el-menu-item index="4-1" :route="{ path: '/main/feedback' }">反馈详情</el-menu-item>
							<el-menu-item index="4-2" :route="{ path: '/main/feedback-total' }">反馈统计</el-menu-item>
					</el-submenu>
					<!-- <el-submenu index="5">
							<template slot="title">
								<i class="el-icon-news"></i>
								<span><b>竞品监测</b></span>
							</template>
							<el-menu-item index="5-1" :route="{ path: '/main/feedback-total' }">竞品列表</el-menu-item>
							<el-menu-item index="5-2" :route="{ path: '/main/competitor-feedback' }">竞品反馈</el-menu-item>
							<el-menu-item index="5-3" :route="{ path: '/main/feedback-total' }">竞品分析</el-menu-item>
					</el-submenu> -->
        </el-menu>
      </el-aside>
      <el-main class="content">
				<!-- <el-row>
					<el-col>
						<el-button size="mini" icon="el-icon-arrow-left" @click="goBack">返回</el-button>
						<hr class="split-line" />
					</el-col>
				</el-row> -->
				<router-view></router-view>
      </el-main>
    </el-container>    
    <el-footer></el-footer>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import mainHeader from '@/components/mainHeader/mainHeader'
import api from '@/utils/api'
import moment from 'moment'

export default {
  data () {
    return {
      primaryColor: '#409eff',
      date: '',
      workflow: [
        {id: 'issued_reissued', index: '2-1', route: {path: '/main/workflow?status=issued_reissued'}, text: '提议', count: null},
        {id: 'permitted', index: '2-2', route: {path: '/main/workflow?status=permitted'}, text: '待执行', count: null},
        {id: 'finished', index: '2-3', route: {path: '/main/workflow?status=finished'}, text: '已执行', count: null},
        {id: 'summed', index: '2-4', route: {path: '/main/workflow?status=summed'}, text: '已总结', count: null},
        {id: 'rejected', index: '2-5', route: {path: '/main/workflow?status=rejected'}, text: '被拒绝', count: null}
      ],
      defaultOpeneds: ['2']
    }
  },
  created () {
    this.getCount()
    this.getDate()
  },
  methods: {
    ...mapActions({ setUserInfo: 'setUserInfo' }),
    refresh () {
      this.getCount()
    },
    getDate () {
      setInterval(() => {
        this.date = moment().locale('zh-cn').format('MM/DD/YYYY HH:mm:ss dddd')
      }, 1000)
    },
    goBack () {
      this.$router.go(-1)
    },
    logout () {
      console.log('logout')
      this.$router.push('/')
      location.reload()
      localStorage.removeItem('userInfo')
    },
    getCount () {
      // const params = {
      //   pagination: {
      //     pageSize: 9999999,
      //     currentPage: 1,
      //     filter: {
      //     }
      //   }
      // }
      api.post('/api/suggestion/count', {fiilter: {}}).then(res => {
        if (res.status === 200 && res.data) {
          // this.workflows = res.data.grid
          console.log(this.workflow)
          this.workflow.forEach(wk => {
            if (wk.id.indexOf('_') > 0) {
              const arr = wk.id.split('_')
              wk.count = res.data[arr[1]] + res.data[arr[0]]
            } else {
              wk.count = res.data[wk.id]
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
      // api.post(`/api/suggestion/pagination`, params).then(res => {
      //   if (res.status === 200 && res.data) {
      //     // this.workflows = res.data.grid
      //     this.workflow.forEach(wk => {
      //       wk.count = res.data.grid.filter(g => wk.id.indexOf(g.status) >= 0).length
      //     })
      //     console.log(this.workflow)
      //   }
      //   // this.$store.dispatch('setLoadingState', false)
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    unbind (userId) {
      const wechatId = null
      const wechatName = ''
      const wechatImage = ''
      const force = 1
      api.post('/api/wechat/bind', {userId, wechatId, wechatName, wechatImage, force}).then(res => {
        this.setUserInfo(res.data)
      })
    }
  },
  components: {
    mainHeader
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  }
}
</script>

<style lang="scss">

.main-header {
	width: 100%;
	box-shadow: 0px 2px 4px #666;
	.main-title-cn {
		font-weight: 800;
		font-size: 24px;
    line-height: 36px;
	}
	.main-title {
		font-weight: 800;
		/* font-size: 24px; */
		/* margin-top: 12px; */
	}
	.main-title-en {
		font-weight: 600;
    font-style: italic;
		line-height: 22px;
	}
}
.work-count {
	color: red;
	font-size: 110%;
}

.suggestion-count {
	sup {
		margin-top: 20px;
	}
}
.menu {
	width: 200px;
  height: 100%;
	overflow: visible;
}

.menu > .el-menu {
	width: 100%;
	box-sizing: border-box;
}

.el-submenu .el-menu-item {
	min-width: 200px;
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
.workflow-box {
	.el-submenu__title {
		height: 100%;
		padding: 0!important;
	}
	.workflow-main {
		padding: 0 20px!important;
	}
}
	li 
		.el-menu-item.is-active {
				color: #FF6600!important;
		}
	

.header-operations {
	display: inline-block;
	float: right;
	padding-right: 30px;
	height: 100%;
}

.header-operations li {
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

.el-input-group--append {
	.el-input__inner {
		border-top-left-radius: 20px;
		border-bottom-left-radius: 20px;
	}
	.el-input-group__append {
		border-top-right-radius: 20px;
		border-bottom-right-radius: 20px;
		background: #FF6600;
		color: #FFF;
	}
}
</style>


