import store from '@/store'

/**
 * @author
 * @description 检查权限
 * @param value
 * @returns {boolean}
 */
export function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const permissions = store.getters['user/permissions']
    const permissionPermissions = value

    return permissions.some((role) => {
      return permissionPermissions.includes(role)
    })
  } else {
    return false
  }
}

/**
 * @author
 * @description 从后端获取所有角色的路由权限并更新`async route`
 */
export function refreshAsyncRoute() {}
