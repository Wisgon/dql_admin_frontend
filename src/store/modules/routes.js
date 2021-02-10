/**
 * @author zhilong
 * @description 路由拦截状态管理，目前两种模式：all模式与intelligence模式，其中partialRoutes是菜单暂未使用
 */
import { asyncRoutes, constantRoutes } from '@/router'
import { getRouterList } from '@/api/router'
import {
  convertRouter,
  filterAsyncRoutes,
  asyncRouteToTree,
  updateAsyncRoute,
} from '@/utils/handleRoutes'
import { getAccessablePages } from '@/api/dql_roleManagement'

const state = () => ({
  routes: [],
  partialRoutes: [],
  allAsyncRoutes: asyncRouteToTree(),
})
const getters = {
  routes: (state) => state.routes,
  partialRoutes: (state) => state.partialRoutes,
  allAsyncRoutes: (state) => state.allAsyncRoutes,
}
const mutations = {
  setRoutes(state, routes) {
    state.routes = constantRoutes.concat(routes)
  },
  setAllRoutes(state, routes) {
    state.routes = constantRoutes.concat(routes)
  },
  setPartialRoutes(state, routes) {
    state.partialRoutes = constantRoutes.concat(routes)
  },
}
const actions = {
  async setRoutes({ commit }, permissions) {
    //从后端获取该用户所拥有的权限下的能访问的page
    const accessablePages = await getAccessablePages()

    // 根据该用户的权限页面来update这个用户有权限的route
    // 这里的accessablePage.data是类似这样的object：
    /**
     *{"editor":{"外链":true,"支付":true,"测试websocket":true,"角色权限":true},"tourist":{"外链":true,"用户管理":true}}
     *其中第一层的key是对应的权限id，第二层的key则是对应能访问的page
     */
    updateAsyncRoute(asyncRoutes, accessablePages)
    const finallyAsyncRoutes = await filterAsyncRoutes(
      [...asyncRoutes],
      permissions
    )
    commit('setRoutes', finallyAsyncRoutes)
    return finallyAsyncRoutes
  },
  async setAllRoutes({ commit }) {
    let { data } = await getRouterList()
    data.push({ path: '*', redirect: '/404', hidden: true })
    let accessRoutes = convertRouter(data)
    commit('setAllRoutes', accessRoutes)
    return accessRoutes
  },
  setPartialRoutes({ commit }, accessRoutes) {
    commit('setPartialRoutes', accessRoutes)
    return accessRoutes
  },
}
export default { state, getters, mutations, actions }
