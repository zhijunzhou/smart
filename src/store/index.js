import Vue from 'vue'
import Vuex from 'vuex'
import com from './modules/com'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    com,
    user
  }
})
// state: {
//   projectTitle: 'Smart办公系统',
//   appid: 'wxbdc5610cc59c1631', // wxbdc5610cc59c1631  wxd97ecfda77d6b9ae
//   scope: 'snsapi_login',
//   redirect_uri: 'https://passport.yhd.com/wechat/login.do', // http://starstech.cc/smart
//   userInfo: {}
// },
// mutations: {
//   setUserInfo (state, userInfo) {
//     state.userInfo = {...state.userInfo, ...userInfo}
//   }
// }

export default store
