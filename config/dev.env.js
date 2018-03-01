'use strict'

const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  servicesCenter: {
    baseURL: 'http://nstart.cc:8688/'
  },
  smartServer: {
    baseURL: 'http://nstart.cc:87/'
  }
})
