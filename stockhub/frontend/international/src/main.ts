import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import ProductDetail from './views/ProductDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { title: 'StockHub Global' }
    },
    {
      path: '/products/:id',
      name: 'ProductDetail',
      component: ProductDetail,
      meta: { title: 'Product Details' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - StockHub Global`
  next()
})

const app = createApp(App)
app.use(router)
app.mount('#app')
