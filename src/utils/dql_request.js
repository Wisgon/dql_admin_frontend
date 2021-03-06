// 这个接口是请求后端api的，不是原生的被mock接管的接口，主要是axios的baseURL为空，然后vue.config.js的devServer那里设置了proxy，接管/api开头的请求
import Vue from 'vue'
import axios from 'axios'
import {
  contentType,
  debounce,
  invalidCode,
  noPermissionCode,
  requestTimeout,
  successCode,
  tokenName,
  tokenInvalid,
} from '@/config'
import store from '@/store'
import qs from 'qs'
import router from '@/router'
import { isArray } from '@/utils/validate'

let loadingInstance

/**
 *
 * @description 判断当前url是否需要加loading
 * @param {*} config
 * @returns
 */
const needLoading = (config) => {
  let status = false
  debounce.forEach((item) => {
    if (Vue.prototype.$baseLodash.includes(config.url, item)) {
      status = true
    }
  })
  return status
}

/**
 *
 * @description 处理code异常
 * @param {*} code
 * @param {*} msg
 */
const handleCode = (code, msg) => {
  switch (code) {
    case invalidCode:
      Vue.prototype.$baseMessage(msg || `后端接口${code}异常`, 'error')
      store.dispatch('user/resetAccessToken').catch(() => {})
      location.reload()
      break
    case noPermissionCode:
      router.push({ path: '/401' }).catch(() => {})
      break
    case tokenInvalid:
      router.push({ path: '/403' }).catch(() => {})
      break
    default:
      Vue.prototype.$baseMessage(msg || `后端接口${code}异常`, 'error')
      break
  }
}

const instance = axios.create({
  // todo:生产环境这里的baseURL记得要改成生产环境的域名，如：http://dql_admin.com
  baseURL: '',
  timeout: requestTimeout,
  headers: {
    'Content-Type': contentType,
  },
})

instance.interceptors.request.use(
  (config) => {
    if (store.getters['user/accessToken']) {
      config.headers[tokenName] = store.getters['user/accessToken']
    }
    //这里会过滤所有为空、0、false的key，如果不需要请自行注释
    if (config.data)
      config.data = Vue.prototype.$baseLodash.pickBy(
        config.data,
        Vue.prototype.$baseLodash.identity
      )

    if (
      contentType === 'application/x-www-form-urlencoded;charset=UTF-8' &&
      config.data
    ) {
      config.data = qs.stringify(config.data)
    }

    if (needLoading(config)) {
      loadingInstance = Vue.prototype.$baseLoading()
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    if (loadingInstance) loadingInstance.close()

    const { status, data, config } = response
    const { code, message } = data
    // 操作正常Code数组
    const codeVerificationArray = isArray(successCode)
      ? [...successCode]
      : [...[successCode]]
    // 是否操作正常
    if (codeVerificationArray.includes(code)) {
      return data
    } else {
      handleCode(code, message)
      return Promise.reject(
        'dgraph_admin请求异常拦截:' +
          JSON.stringify({ url: config.url, code, message }) || 'Error'
      )
    }
    return data
  },
  (error) => {
    if (loadingInstance) loadingInstance.close()
    const { response, message } = error
    // 这里的error.response.data就是我后端返回的信息对象，格式是{"code": x, "message": y}
    if (error.response && error.response.data) {
      const { code, message } = response
      handleCode(code, message)
      return Promise.reject(error)
    } else {
      let { message } = error
      if (message === 'Network Error') {
        message = '后端接口连接异常'
      }
      if (message.includes('timeout')) {
        message = '后端接口请求超时'
      }
      if (message.includes('Request failed with status code')) {
        const code = message.substr(message.length - 3)
        message = '后端接口' + code + '异常'
      }
      Vue.prototype.$baseMessage(message || `后端接口未知异常`, 'error')
      return Promise.reject(error)
    }
  }
)

export default instance
