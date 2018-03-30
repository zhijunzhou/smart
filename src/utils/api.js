import axios from 'axios'

const isProduction = !!(process.env.NODE_ENV === 'production')
const baseURL = isProduction ? 'http://59.175.25.0:7777' : 'http://58.48.199.131:7777'
const tokenKey = 'x-auth-token'

// smart service
const api = axios.create({
  baseURL: baseURL,
  // withCredentials: true,
  timeout: 0
})

const getToken = () => {
  return window.sessionStorage.getItem(tokenKey)
}

api.interceptors.request.use(config => {
  if (config.url.indexOf('/login') === -1) {
    config.headers[tokenKey] = getToken()
  }
  return config
})

export default api
