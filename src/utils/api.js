import axios from 'axios'
import env from '../../config'

const isProduction = !!(process.env.NODE_ENV === 'production')
const environment = isProduction ? env.build.env : env.dev.env

// smart service
const api = axios.create({
  baseURL: environment.smartServer.baseURL,
  withCredentials: true,
  timeout: 30000
})

export default api
