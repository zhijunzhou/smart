<template>
  <el-container>
    <el-header height="auto" class="login-header">
      <el-row>
        <img src="./../assets/logo.png">
      </el-row>
      <el-row>
        工作管理
      </el-row>
      <!-- <h1 class="project-title text-center"><span class="header-logo">$</span><span class="logo-txt">mart</span></h1> -->
    </el-header>
    <el-main>      
      <el-row>
        <el-col v-show="!inputMode">
          <div class="grid-content text-center">
            <canvas id="login_container"></canvas>
          </div>
          <div class="text-center">
            <small>请打开微信扫一扫，扫描二维码登录</small>
            <br>
            <small>5分钟后本页面自动关闭</small>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="text-center">
          <!-- <el-button @click="startJourney">快速体验</el-button>
          <el-button v-if="inputMode" @click="switchInputMode">微信登陆</el-button>
          <el-button v-else @click="switchInputMode">密码登陆</el-button> -->
        </el-col>
      </el-row>
      <el-row v-if="inputMode">
        <el-col :lg="9" :md="8" :sm="6" :xs="3">&nbsp;</el-col>
        <el-col :lg="6" :md="8" :sm="12" :xs="18" class="text-center">
          <el-form :model="userInformation">
            <el-form-item>
              <el-input v-model="userInformation.name" placeholder="工号" @keyup.enter="login"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input type="password" v-model="userInformation.password" placeholder="密码" @keyup.enter.native="login"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="login" class="longbtn">登录</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :lg="9" :md="8" :sm="6" :xs="3">&nbsp;</el-col>
      </el-row>
    </el-main>
    <el-footer class="text-center"><small>© 2018 www.starstech.cc. All Rights Reserved</small></el-footer>
  </el-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import QRCode from 'qrcode'
import service from '@/utils/service'
import api from '@/utils/api'
import { Message } from 'element-ui'

export default {
  data () {
    return {
      _code: undefined,
      timer: null,
      register: true,
      qrMode: true,
      inputMode: false,
      count: 0,
      userInformation: {
        name: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    ...mapActions({ setUserInfo: 'setUserInfo' }),
    startJourney () {
      clearInterval(this.timer)
      this.$router.push('/main')
    },
    switchInputMode () {
      this.inputMode = true
      clearInterval(this.timer)
    },
    cacheToken (headers) {
      let key = 'x-auth-token'
      window.sessionStorage.setItem(key, headers[key])
    },
    login () {
      const userName = this.userInformation.name
      const passWord = this.userInformation.password
      this.$store.dispatch('setLoadingState', true)
      api.post('/api/user/login', {userName, passWord}).then(login => {
        // if (this.$store.state.userInfo.openid) {
        if (!this.inputMode || !this.register) {
          this.bind(login.data.userId)
        }
        this.$store.dispatch('setLoadingState', false)
        this.setUserInfo(login.data)
        this.cacheToken(login.headers)
        // }
        Message({
          showClose: true,
          message: '欢迎进入Smart!',
          type: 'success'
        })
        this.$router.push('/main/workflow?status=issued_reissued')
      }).catch(error => {
        this.$store.dispatch('setLoadingState', false)
        if (error.response) {
          Message({
            showClose: true,
            message: error.response.statusText,
            type: 'error'
          })
          if (error.response.status === 401) {
            this.register = false
          }
          console.log('error')
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data)
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message)
        }
      })
    },
    bind (userId) {
      const wechatId = this.userInfo.openid ? this.userInfo.openid : ''
      const wechatName = this.userInfo.nickname ? this.userInfo.nickname : ''
      const wechatImage = this.userInfo.headimgurl ? this.userInfo.headimgurl : ''
      const force = 1
      console.log(userId, wechatId, this.userInfo)
      api.post('/api/wechat/bind', {userId, wechatId, wechatName, wechatImage, force}).then(login => {
        this.setUserInfo(login.data)
        console.log(login)
      })
    },
    guid () {
      return 'xxxxxxxxxxxxyxxxyx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    },
    getWXCode () {
      console.log(this.$message)
      const uid = this.guid()
      let self = this
      let $path = window.encodeURI(`http://www.starstech.cc/login?shopID=${this.$route.query.shopID}_${uid}`)
      let url = '/wepay/webAuthCodeUrl?path=' + $path
      console.log('getWXCode')
      service.get(url).then(res => {
        let wxUrl = res.data
        self.showLoading = false
        const canvas = document.getElementById('login_container')

        QRCode.toCanvas(canvas, wxUrl, function (error) {
          if (error) {
            alert(error)
          }
        })
        // window.location.href = wxUrl
      })
      const infoUrl = '/getUserInfo?uid=' + uid
      this.timer = setInterval(() => {
        this.count += 1
        if (this.count > 150) {
          clearInterval(this.timer)
          window.close()
        }
        service.get(infoUrl).then(res => {
          // let wxUrl = res.data
          console.log(res)
          if (res.data.openid) {
            clearInterval(this.timer)
            const openid = res.data.openid
            console.log(res)
            service.get('/wepay/userinfo?openid=' + openid).then(r => {
              console.log(r)
              // this.$store.commit('setUserInfo', r.data)
              this.setUserInfo(r.data)
              api.post('/api/wechat/login', {wechatId: openid}).then(login => {
                // this.$store.commit('setUserInfo', login.data)
                this.setUserInfo(login.data)
                this.cacheToken(login.headers)
                console.log(this.$store.state)
                this.$router.push('/main/workflow?status=issued_reissued')
              }).catch(error => {
                if (error.response) {
                  // The request was made and the server responded with a status code
                  // that falls out of the range of 2xx
                  if (error.response.status === 401) {
                    Message({
                      showClose: true,
                      message: '微信未绑定用户, 登陆后将绑定微信',
                      type: 'error'
                    })
                    this.register = false
                    this.inputMode = true
                  }
                  console.log(error.response.data)
                  console.log(error.response.status)
                  console.log(error.response.headers)
                } else if (error.request) {
                  // The request was made but no response was received
                  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                  // http.ClientRequest in node.js
                  console.log(error.request)
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.log('Error', error.message)
                }
              })
            })
          }
        // window.location.href = wxUrl
        })
      }, 2000)
    }
  },
  mounted () {
    this.getWXCode()
    /* eslint-disable no-undef */
    // const self = this
    // const timestamp = Date.parse(new Date())

    // const obj = new WxLogin({
    //   id: 'login_container',
    //   appid: self.$store.state.appid,
    //   scope: self.$store.state.scope,
    //   redirect_uri: self.$store.state.redirect_uri,
    //   state: Math.random().toString(36).substr(2, 15),
    //   style: 'black',
    //   href: 'http://localhost:8080/static/style/qrcode.css'
    //   // href: http://starstech.cc/smart/static/style/qrcode.css
    // })

    // console.log(obj, this.$store.state)
  }
}
</script>

<style>
#login_container {
  height: 400px;  
}
.project-title {
  line-height: 60px;
}

.longbtn {
  width: 100%;
}

.login-header {
  /* background-color: #409EFF; */
  margin-top: 30px;
  text-align: center;
}
</style>


