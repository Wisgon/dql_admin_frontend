/**
 * @author zhilong
 * @description all模式渲染后端返回路由
 * @param constantRoutes
 * @returns {*}
 */
export function convertRouter(asyncRoutes) {
  return asyncRoutes.map((route) => {
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = (resolve) => require(['@/layouts'], resolve)
      } else if (route.component === 'EmptyLayout') {
        route.component = (resolve) =>
          require(['@/layouts/EmptyLayout'], resolve)
      } else {
        const index = route.component.indexOf('views')
        const path =
          index > 0 ? route.component.slice(index) : `views/${route.component}`
        route.component = (resolve) => require([`@/${path}`], resolve)
      }
    }
    if (route.children && route.children.length)
      route.children = convertRouter(route.children)
    if (route.children && route.children.length === 0) delete route.children
    return route
  })
}

/**
 * @author zhilong
 * @description 判断当前路由是否包含权限
 * @param permissions
 * @param route
 * @returns {boolean|*}
 */
function hasPermission(permissions, route) {
  if (route.meta && route.meta.permissions) {
    return permissions.some((role) => route.meta.permissions.includes(role))
  } else {
    return true
  }
}

/**
 * @author zhilong
 * @description intelligence模式根据permissions数组拦截路由
 * @param routes
 * @param permissions
 * @returns {[]}
 */
export function filterAsyncRoutes(routes, permissions) {
  const finallyRoutes = []
  routes.forEach((route) => {
    const item = { ...route }
    if (hasPermission(permissions, item)) {
      if (item.children) {
        item.children = filterAsyncRoutes(item.children, permissions)
      }
      finallyRoutes.push(item)
    }
  })
  return finallyRoutes
}

/**
 * @author zhilong
 * @description 将所有async route变为一个tree结构
 */
import { asyncRoutes } from '@/router'
import { isInArray } from './useful'
export function asyncRouteToTree() {
  return parseTree(asyncRoutes)
}

function parseTree(routes) {
  var tree = []
  for (var i = 0; i < routes.length; i++) {
    // 首先，排除那些特殊页面和不需要特殊权限的页面
    if (
      routes[i].path == null ||
      routes[i].path == '*' ||
      routes[i].hidden == true ||
      routes[i].path == '/personalCenter' ||
      routes[i].path == '/'
    ) {
      continue
    }
    var title = 'notile title'
    var tree_content = {}
    if (routes[i].meta != null && routes[i].meta.title != null) {
      title = routes[i].meta.title
    }

    if (routes[i].children != null) {
      tree_content.children = parseTree(routes[i].children, i)
    } else {
      tree_content.value = title // 后端只保存有value的最终子节点
      tree_content.children = []
    }
    tree_content.name = title
    tree.push(tree_content)
  }
  return tree
}

/**
 * @author zhilong
 * @description 接受后端传来的该用户的权限页面，返回修改后的async route
 * @param accessable_pages 该用户有权访问的页面（是最终页面，也就是页面树的最终子节点）
 */
export function updateAsyncRoute(asyncRoutes, accessable_pages) {
  // 遍历asyncRoute，并添加权限
  var p = { meta: { permissions: [] } }
  addPermission(asyncRoutes, accessable_pages.data, p)
  // console.log('object :', asyncRoutes)
}

function addPermission(routes, accesable_pages_data, parent) {
  for (var i = 0; i < routes.length; i++) {
    if (routes[i].children != null) {
      if (routes[i].children.length > 0) {
        addPermission(routes[i].children, accesable_pages_data, routes[i])
      }
    } else {
      // 下面的if的判断一个都不能少且顺序不能错，不然就会有bug且没提示
      if (
        routes[i].meta &&
        routes[i].meta.permissions != null &&
        routes[i].meta.title != null
      ) {
        for (let role_id in accesable_pages_data) {
          if (accesable_pages_data[role_id][routes[i].meta.title] == true) {
            if (!isInArray(routes[i].meta.permissions, role_id)) {
              routes[i].meta.permissions.push(role_id)
            }
            if (parent.meta && parent.meta.permissions != null) {
              if (!isInArray(parent.meta.permissions, role_id)) {
                parent.meta.permissions.push(role_id)
              }
            }
          }
        }
      }
    }
  }
}
