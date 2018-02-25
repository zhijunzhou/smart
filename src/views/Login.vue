<template>
  <el-container>
    <el-header><h1>{{$store.state.projectTitle}}</h1></el-header>
    <el-main>      
      <el-row>
        <el-col :span="24">
          <div class="grid-content">
            <div id="login_container"></div>
          </div>
        </el-col>
        <el-col :span="24">
          <el-button @click="startJourney">快速体验</el-button>
        </el-col>
      </el-row>
    </el-main>
    <el-footer><small>© 2018 www.starstech.cc. All Rights Reserved</small></el-footer>
  </el-container>
</template>

<script>

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
    const self = this
    const obj = new WxLogin({
      id: 'login_container',
      appid: self.$store.state.appid,
      scope: self.$store.state.scope,
      redirect_uri: self.$store.state.redirect_uri,
      state: Math.random().toString(36).substr(2, 15),
      style: 'black',
      href: 'http://localhost:8080/static/style/qrcode.css'
      // href: http://starstech.cc/smart/static/style/qrcode.css
    })

    console.log(obj, this.$store.state)
  }
}
</script>

<style>
#login_container {
  height: 400px;
}
</style>


