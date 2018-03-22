import * as types from '../types'

const state = {
  userInfo: JSON.parse(localStorage.getItem('userInfo'))
}

const actions = {
  setUserInfo ({ commit }, res) {
    localStorage.setItem('userInfo', JSON.stringify(res))
    commit(types.SET_USER_INFO, res)
  }
}

const getters = {
  userInfo: state => state.userInfo
}

const mutations = {
  [types.SET_USER_INFO] (state, res) {
    state.userInfo = res
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
