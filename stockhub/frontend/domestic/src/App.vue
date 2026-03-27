<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'

const route = useRoute()
const authStore = useAuthStore()

onMounted(() => {
  // 检查Token有效性
  const token = localStorage.getItem('token')
  if (token) {
    const user = localStorage.getItem('user')
    if (user) {
      authStore.login(token, JSON.parse(user))
    }
  }
})

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  authStore.logout()
  window.location.href = '/login'
}

const activeMenu = computed(() => {
  const path = route.path
  if (path === '/') return '1'
  if (path === '/products') return '3'
  if (path === '/my-demands') return '2'
  if (path === '/merchant-center') return '4'
  return '1'
})
</script>

<template>
  <el-container class="h-screen">
    <!-- 顶部导航 -->
    <el-header class="header">
      <div class="header-left">
        <el-icon :size="24" color="#7c3aed"><Store /></el-icon>
        <span class="title">库存易</span>
        <span class="badge">国内版</span>
      </div>
      <div class="header-center">
        <el-menu
          mode="horizontal"
          :default-active="activeMenu"
          router
        >
          <el-menu-item index="1" route="/">求购大厅</el-menu-item>
          <el-menu-item index="3" route="/products">库存发布</el-menu-item>
          <el-menu-item index="2" route="/my-demands">我的需求</el-menu-item>
          <el-menu-item index="4" route="/merchant-center">商户中心</el-menu-item>
        </el-menu>
      </div>
      <div class="header-right" v-if="authStore.isAuthenticated">
        <el-dropdown>
          <span class="user-name">{{ authStore.user?.name }}</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="header-right" v-else>
        <el-button type="primary" @click="$router.push('/login')">登录/注册</el-button>
      </div>
    </el-header>

    <!-- 主内容区 -->
    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  height: 60px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.header-center {
  flex: 1;
  margin: 0 40px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-size: 14px;
  cursor: pointer;
  color: white;
}

:deep(.el-menu--horizontal) {
  border-bottom: none;
}

:deep(.el-menu--horizontal .el-menu-item) {
  color: white;
  border-bottom: 2px solid transparent;
}

:deep(.el-menu--horizontal .el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.1);
}

:deep(.el-menu--horizontal .el-menu-item.is-active) {
  border-bottom-color: white;
  font-weight: 600;
}
</style>
