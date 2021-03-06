import request from '@/utils/dql_request'

export function getList(data) {
  return request({
    url: '/api/userManagement/getList',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/api/userManagement/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/api/userManagement/doDelete',
    method: 'post',
    data,
  })
}
