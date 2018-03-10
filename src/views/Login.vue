<template>
  <el-container>
    <el-header><h1 class="project-title text-center">{{$store.state.projectTitle}}</h1></el-header>
    <el-main>      
      <el-row>
        <el-col :span="24">
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
    </el-main>
    <el-footer class="text-center"><small>© 2018 www.starstech.cc. All Rights Reserved</small></el-footer>
  </el-container>
</template>

<script>
import QRCode from 'qrcode'
import service from '@/utils/service'

export default {
  data () {
    return {
      _code: undefined,
      timer: null
    }
  },
  methods: {
    startJourney () {
      clearInterval(this.timer)
      this.$router.push('/main')
    },
    guid () {
      return 'xxxxxxxxxxxxyxxxyx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    },
    getWXCode () {
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
              this.$router.push('/main')
            })
          }
        // window.location.href = wxUrl
        })
      }, 5000)
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
</style>


