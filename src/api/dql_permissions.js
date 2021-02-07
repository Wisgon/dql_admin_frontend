import request from '@/utils/dql_request'

export function getPermissionPage(data) {
  return request({
    url: '/api/permissions',
    method: 'post',
    data,
  })
}
