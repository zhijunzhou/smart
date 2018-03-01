import axios from 'axios'
import env from '../../config'

const isProduction = !!(process.env.NODE_ENV === 'production')
const environment = isProduction ? env.build.env : env.dev.env

// node service
const service = axios.create({
  baseURL: environment.servicesCenter.baseURL,
  withCredentials: true,
  timeout: 30000
})

export default service
