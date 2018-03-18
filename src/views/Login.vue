<template>
  <el-container>
    <el-header class="login-header"><h1 class="project-title text-center"><span class="header-logo">$</span><span class="logo-txt">mart</span></h1></el-header>
    <el-main>      
      <el-row>
        <el-col :span="8" :offset="8">
          <div class="grid-content text-center">
            <canvas id="login_container"></canvas>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="text-center">
          <el-button @click="startJourney">快速体验</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="9">
          <el-form label-position="right" label-width="80px" :model="userInformation">
            <el-form-item label="用户名">
              <el-input v-model="userInformation.name"></el-input>
            </el-form-item>
            <el-form-item label="密码" >
              <el-input type="password" v-model="userInformation.password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="login" plain class="longbtn">登陆</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-main>
    <el-footer class="text-center"><small>© 2018 www.starstech.cc. All Rights Reserved</small></el-footer>
  </el-container>
</template>

<script>
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
      userInformation: {
        name: '',
        password: ''
      }
    }
  },
  methods: {
    startJourney () {
      clearInterval(this.timer)
      this.$router.push('/main')
    },
    login () {
      const userName = this.userInformation.name
      const passWord = this.userInformation.password
      api.post('/api/user/login', {userName, passWord}).then(login => {
        this.$store.commit('setUserInfo', login.data)
        // if (this.$store.state.userInfo.openid) {
        this.bind()
        // }
        Message({
          showClose: true,
          message: '欢迎进入Smart!',
          type: 'success'
        })
        this.$router.push('/main')
      }).catch(error => {
        if (error.response) {
          Message({
            showClose: true,
            message: error.response.statusText,
            type: 'error'
          })
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
    bind () {
      const userId = this.$store.state.userInfo.userId
      const wechatId = this.$store.state.userInfo.openid ? this.$store.state.userInfo.openid : ''
      const nickName = this.$store.state.userInfo.nickname
      const headImgUrl = this.$store.state.userInfo.headimgurl
      const force = 1
      console.log(userId, wechatId, this.$store.state.userInfo)
      api.post('/api/wechat/bind', {userId, wechatId, nickName, headImgUrl, force}).then(login => {
        this.$store.commit('setUserInfo', login.data)
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
        service.get(infoUrl).then(res => {
          // let wxUrl = res.data
          console.log(res)
          if (res.data.openid) {
            clearInterval(this.timer)
            const openid = res.data.openid
            console.log(res)
            service.get('/wepay/userinfo?openid=' + openid).then(r => {
              console.log(r)
              this.$store.commit('setUserInfo', r.data)
              api.post('/api/wechat/login', {wechatId: openid}).then(login => {
                this.$store.commit('setUserInfo', login.data)
                this.$router.push('/main')
                console.log(login)
              }).catch(error => {
                this.register = false
                if (error.response) {
                  // The request was made and the server responded with a status code
                  // that falls out of the range of 2xx
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
  background-color: #409EFF;
}
</style>


