import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    projectTitle: 'Smart办公系统',
    appid: 'wxbdc5610cc59c1631', // wxbdc5610cc59c1631  wxd97ecfda77d6b9ae
    scope: 'snsapi_login',
    redirect_uri: 'https://passport.yhd.com/wechat/login.do', // http://starstech.cc/smart
    userInfo: {}
  },
  mutations: {
    setUserInfo (state, userInfo) {
      state.userInfo = {...state.userInfo, ...userInfo}
    }
  }
})

export default store
