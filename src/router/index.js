import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Main from '@/views/Main'
import Expand from '@/views/Expand/Expand'
import Analysis from '@/views/Analysis/Analysis'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      children: [
        {
          path: '',
          name: 'expand',
          component: Expand
        },
        {
          path: 'test',
          name: 'test',
          component: Expand
        },
        {
          path: 'analysis',
          name: 'analysis',
          component: Analysis
        }
      ]
    }
  ]
})
