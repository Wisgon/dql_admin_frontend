import request from '@/utils/dql_request'

export function getList(data) {
  return request({
    url: '/api/roleManagement/getList',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/api/roleManagement/doEdit',
    method: 'post',
    data,
  })
}

export function doCreate(data) {
  return request({
    url: '/api/roleManagement/create_role',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/api/roleManagement/doDelete',
    method: 'post',
    data,
  })
}

export function getAccessablePages(param = '') {
  return request({
    url: '/api/roleManagement/accessable_pages' + param,
    method: 'get',
  })
}
