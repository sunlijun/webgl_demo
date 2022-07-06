import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/index',
    name: '首页',
    meta: {
      title: '首页',
      keepAlive: true,
      requireAuth: true,
    },
    component: () => import('@/pages/index.vue'),
  },
  {
    path: '/login',
    name: '登录',
    meta: {
      title: '登录',
      keepAlive: true,
      requireAuth: true,
    },
    component: () => import('@/pages/login.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router
