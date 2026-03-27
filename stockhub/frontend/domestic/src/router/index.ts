import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue'),
      meta: { title: '求购大厅', requiresAuth: false },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: { title: '登录', requiresAuth: false },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue'),
      meta: { title: '注册', requiresAuth: false },
    },
    {
      path: '/my-demands',
      name: 'MyDemands',
      component: () => import('../views/MyDemands.vue'),
      meta: { title: '我的需求', requiresAuth: true },
    },
    {
      path: '/products',
      name: 'Products',
      component: () => import('../views/Products.vue'),
      meta: { title: '库存商品', requiresAuth: true },
    },
    {
      path: '/products/:id',
      name: 'ProductDetail',
      component: () => import('../views/ProductDetail.vue'),
      meta: { title: '商品详情', requiresAuth: true },
    },
    {
      path: '/merchant-center',
      name: 'MerchantCenter',
      component: () => import('../views/MerchantCenter.vue'),
      meta: { title: '商户中心', requiresAuth: true },
    },
    {
      path: '/stats',
      name: 'Stats',
      component: () => import('../views/Stats.vue'),
      meta: { title: '数据统计', requiresAuth: true },
    },
  ],
})

export default router
