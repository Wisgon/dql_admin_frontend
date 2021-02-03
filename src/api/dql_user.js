import request from '@/utils/dql_request'

export function register(data) {
  return request({
    url: '/api/user/regist',
    method: 'post',
    data: data,
  })
}

export function login(data) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data: data,
  })
}

export function getUserInfo() {
  return request({
    url: '/api/user/userInfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/api/user/logout',
    method: 'post',
  })
}
