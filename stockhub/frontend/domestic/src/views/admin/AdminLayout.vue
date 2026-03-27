<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <h2 class="logo-text">🔧 Admin</h2>
        </div>
      </div>

      <nav class="sidebar-nav">
        <router-link
          to="/admin/dashboard"
          class="nav-item"
          active-class="active"
        >
          <i class="icon">📊</i>
          <span>仪表盘</span>
        </router-link>

        <router-link
          to="/admin/users"
          class="nav-item"
          active-class="active"
        >
          <i class="icon">👥</i>
          <span>用户管理</span>
        </router-link>

        <router-link
          to="/admin/merchants"
          class="nav-item"
          active-class="active"
        >
          <i class="icon">🏪</i>
          <span>商户管理</span>
        </router-link>

        <router-link
          to="/admin/demands"
          class="nav-item"
          active-class="active"
        >
          <i class="icon">📋</i>
          <span>求购管理</span>
        </router-link>

        <router-link
          to="/admin/products"
          class="nav-item"
          active-class="active"
        >
          <i class="icon">📦</i>
          <span>商品管理</span>
        </router-link>

        <router-link
          to="/admin/orders"
          class="nav-item"
          active-class="active"
        >
          <i class="icon">🛒</i>
          <span>订单管理</span>
        </router-link>

        <router-link
          to="/admin/categories"
          class="nav-item"
          active-class="active"
        >
          <i class="icon">🏷️</i>
          <span>类目管理</span>
        </router-link>

        <router-link
          to="/admin/settings"
          class="nav-item"
          active-class="active"
        >
          <i class="icon">⚙️</i>
          <span>系统设置</span>
        </router-link>
      </nav>
    </aside>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 顶部栏 -->
      <header class="header">
        <div class="header-left">
          <button class="btn btn-ghost" @click="toggleSidebar">
            <i class="icon">☰</i>
          </button>
          <h1 class="page-title">{{ pageTitle }}</h1>
        </div>

        <div class="header-right">
          <div class="user-menu">
            <div class="user-avatar">{{ user?.name?.charAt(0) || 'A' }}</div>
            <div class="user-info">
              <div class="user-name">{{ user?.name || 'Admin' }}</div>
              <div class="user-role">{{ user?.role || '管理员' }}</div>
            </div>
          </div>
          <button @click="logout" class="btn btn-ghost btn-sm">
            <i class="icon">🚪</i>
            退出
          </button>
        </div>
      </header>

      <!-- 路由视图 -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const sidebarCollapsed = ref(false)

const user = computed(() => authStore.user)

const pageTitle = computed(() => {
  const titleMap: Record<string, string> = {
    '/admin/dashboard': '仪表盘',
    '/admin/users': '用户管理',
    '/admin/merchants': '商户管理',
    '/admin/demands': '求购管理',
    '/admin/products': '商品管理',
    '/admin/orders': '订单管理',
    '/admin/categories': '类目管理',
    '/admin/settings': '系统设置',
  }
  return titleMap[route.path] || '管理系统'
})

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-secondary);
}

/* 侧边栏 */
.sidebar {
  width: 240px;
  background: var(--bg-dark);
  color: var(--text-inverse);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  transition: width var(--transition-base);
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--border-dark);
}

.logo-text {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-inverse);
}

.sidebar-nav {
  flex: 1;
  padding: var(--space-4) 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-6);
  color: var(--text-tertiary);
  text-decoration: none;
  transition: all var(--transition-base);
  margin: 0 var(--space-2);
  border-radius: var(--radius-md);
}

.nav-item:hover {
  background: var(--border-dark);
  color: var(--text-inverse);
}

.nav-item.active {
  background: var(--primary-color);
  color: var(--text-inverse);
}

.nav-item .icon {
  font-size: var(--text-lg);
  min-width: 24px;
}

.nav-item span {
  white-space: nowrap;
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 顶部栏 */
.header {
  background: var(--bg-primary);
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.page-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-4);
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--primary-gradient);
  color: var(--text-inverse);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-primary);
}

.user-role {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

/* 内容区 */
.content {
  flex: 1;
  padding: var(--space-6);
  overflow-y: auto;
}

/* 响应式 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -240px;
    z-index: var(--z-modal);
  }

  .sidebar.open {
    left: 0;
  }

  .main-content {
    margin-left: 0;
  }
}
</style>
