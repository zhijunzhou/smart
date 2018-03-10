import axios from 'axios'
// import env from '../../config'

// const isProduction = !!(process.env.NODE_ENV === 'production')
// const environment = isProduction ? env.build.env : env.dev.env

const ajaxUrl = process.env.NODE_ENV === 'development' ? 'http://nstart.cc:8688' : process.env.NODE_ENV === 'production' ? 'http://nstart.cc:80' : 'https://debug.url.com'

// node service
const service = axios.create({
  baseURL: ajaxUrl,

  // baseURL: environment.servicesCenter.baseURL,
  withCredentials: true,
  timeout: 30000
})

export default service
