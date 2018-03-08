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

export default {
  data () {
    return {
      _code: undefined
    }
  },
  methods: {
    startJourney () {
      this.$router.push('/main')
    }
  },
  mounted () {
    /* eslint-disable no-undef */
    // const self = this
    // const timestamp = Date.parse(new Date())
    const canvas = document.getElementById('login_container')

    QRCode.toCanvas(canvas, 'url', function (error) {
      if (error) {
        alert(error)
      }
    })
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


