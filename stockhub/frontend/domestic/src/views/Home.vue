<template>
  <div class="home-page">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <h1 class="logo-text">📦 StockHub</h1>
          </div>
          <nav class="nav">
            <router-link to="/" class="nav-link active">求购大厅</router-link>
            <router-link to="/products" class="nav-link">库存商品</router-link>
            <router-link to="/merchant-center" class="nav-link">商户中心</router-link>
          </nav>
          <div class="header-actions">
            <button v-if="!isAuthenticated" @click="showLoginDialog" class="btn btn-ghost">
              <i class="icon">👤</i>
              登录
            </button>
            <div v-else class="user-menu">
              <span class="user-name">{{ user?.name }}</span>
              <button @click="logout" class="btn btn-ghost btn-sm">退出</button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="main-content">
      <div class="container">
        <!-- 搜索栏 -->
        <div class="search-section">
          <div class="search-box">
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="搜索求购需求..."
              @input="handleSearch"
            >
            <button @click="handleSearch" class="btn btn-primary">
              <i class="icon">🔍</i>
              搜索
            </button>
          </div>
          
          <!-- 筛选标签 -->
          <div class="filter-tags">
            <button
              v-for="category in categories"
              :key="category.id"
              @click="filterByCategory(category.id)"
              :class="['tag', { active: selectedCategory === category.id }]"
            >
              <span class="tag-icon">{{ category.icon }}</span>
              {{ category.name }}
            </button>
            <button
              @click="resetFilters"
              :class="['tag', { active: selectedCategory === null }]"
            >
              全部
            </button>
          </div>
        </div>

        <!-- 求购列表 -->
        <div class="demands-section">
          <div class="section-header">
            <h2 class="section-title">
              求购需求
              <span class="badge badge-primary">{{ totalDemands }}</span>
            </h2>
            <div class="section-actions">
              <select v-model="sortBy" @change="loadDemands" class="select">
                <option value="latest">最新发布</option>
                <option value="price_asc">价格从低到高</option>
                <option value="price_desc">价格从高到低</option>
                <option value="quantity_desc">数量从多到少</option>
              </select>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="loading" class="loading-container">
            <div class="skeleton-loader">
              <div v-for="i in 6" :key="i" class="skeleton-card">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text short"></div>
              </div>
            </div>
          </div>

          <!-- 求购卡片列表 -->
          <div v-else-if="demands.length > 0" class="demands-grid">
            <div
              v-for="demand in demands"
              :key="demand.id"
              @click="viewDemand(demand.id)"
              class="demand-card card"
            >
              <div class="card-body">
                <div class="demand-header">
                  <span class="badge" :class="getDemandStatusBadge(demand.status)">
                    {{ getDemandStatusText(demand.status) }}
                  </span>
                  <span class="demand-time">{{ formatTime(demand.createdAt) }}</span>
                </div>
                
                <h3 class="demand-title">{{ demand.title }}</h3>
                <p class="demand-description line-clamp-2">{{ demand.description }}</p>
                
                <div class="demand-meta">
                  <div class="meta-item">
                    <i class="icon">📊</i>
                    <span>数量: {{ demand.quantity }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="icon">💰</i>
                    <span>预算: ¥{{ formatPrice(demand.price) }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="icon">🏷️</i>
                    <span>{{ getCategoryName(demand.categoryId) }}</span>
                  </div>
                </div>
              </div>
              
              <div class="card-footer">
                <div class="demand-user">
                  <div class="user-avatar">{{ demand.userName?.charAt(0) || '?' }}</div>
                  <span class="user-name">{{ demand.userName || '匿名用户' }}</span>
                </div>
                <button @click.stop="createInquiry(demand)" class="btn btn-primary btn-sm">
                  <i class="icon">💬</i>
                  询盘
                </button>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="empty-state">
            <div class="empty-icon">📭</div>
            <h3>暂无求购需求</h3>
            <p>还没有人发布求购需求，快来发布第一个吧！</p>
            <button @click="createDemand" class="btn btn-primary">
              <i class="icon">➕</i>
              发布求购
            </button>
          </div>

          <!-- 分页 -->
          <div v-if="totalDemands > 0" class="pagination">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="btn btn-ghost"
            >
              上一页
            </button>
            <span class="page-info">第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage >= totalPages"
              class="btn btn-ghost"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- 创建求购弹窗 -->
    <CreateDemandDialog
      v-if="showDialog"
      @close="showDialog = false"
      @success="handleCreateSuccess"
    />

    <!-- 登录弹窗 -->
    <LoginDialog
      v-if="showLogin"
      @close="showLogin = false"
      @success="handleLoginSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import CreateDemandDialog from '@/components/CreateDemandDialog.vue'
import LoginDialog from '@/components/LoginDialog.vue'
import api from '@/api'

const router = useRouter()
const authStore = useAuthStore()

// 状态
const demands = ref<any[]>([])
const categories = ref<any[]>([])
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref<number | null>(null)
const sortBy = ref('latest')
const currentPage = ref(1)
const pageSize = ref(12)
const totalDemands = ref(0)
const showDialog = ref(false)
const showLogin = ref(false)

// 计算属性
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const totalPages = computed(() => Math.ceil(totalDemands.value / pageSize.value))

// 方法
const loadDemands = async () => {
  loading.value = true
  try {
    const params: any = {
      page: currentPage.value,
      limit: pageSize.value,
      sort: sortBy.value,
    }
    
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    
    if (selectedCategory.value) {
      params.categoryId = selectedCategory.value
    }
    
    const response = await api.demands.findAll(params)
    demands.value = response.data
    totalDemands.value = response.total
  } catch (error) {
    console.error('加载求购列表失败:', error)
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const response = await api.categories.findAll()
    categories.value = response.data
  } catch (error) {
    console.error('加载类目失败:', error)
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadDemands()
}

const filterByCategory = (categoryId: number) => {
  selectedCategory.value = categoryId
  currentPage.value = 1
  loadDemands()
}

const resetFilters = () => {
  selectedCategory.value = null
  searchQuery.value = ''
  currentPage.value = 1
  loadDemands()
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadDemands()
  }
}

const viewDemand = (id: string) => {
  router.push(`/demands/${id}`)
}

const createInquiry = (demand: any) => {
  if (!isAuthenticated.value) {
    showLogin.value = true
    return
  }
  // TODO: 实现询盘创建
  console.log('创建询盘:', demand.id)
}

const createDemand = () => {
  if (!isAuthenticated.value) {
    showLogin.value = true
    return
  }
  showDialog.value = true
}

const showLoginDialog = () => {
  showLogin.value = true
}

const handleCreateSuccess = () => {
  showDialog.value = false
  currentPage.value = 1
  loadDemands()
}

const handleLoginSuccess = () => {
  showLogin.value = false
}

const logout = () => {
  authStore.logout()
  router.push('/')
}

// 工具方法
const formatTime = (time: string) => {
  const date = new Date(time)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`
  return date.toLocaleDateString()
}

const formatPrice = (price: number) => {
  if (price >= 10000) {
    return `${(price / 10000).toFixed(1)}万`
  }
  return price.toLocaleString()
}

const getCategoryName = (categoryId: string) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category?.name || '未分类'
}

const getDemandStatusBadge = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'badge-warning',
    matched: 'badge-success',
    completed: 'badge-primary',
    cancelled: 'badge-error',
  }
  return statusMap[status] || 'badge-tertiary'
}

const getDemandStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待匹配',
    matched: '已匹配',
    completed: '已完成',
    cancelled: '已取消',
  }
  return statusMap[status] || '未知'
}

// 生命周期
onMounted(() => {
  loadDemands()
  loadCategories()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: var(--bg-secondary);
}

/* 顶部导航 */
.header {
  background: var(--bg-primary);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  transition: all var(--transition-base);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo-text {
  font-size: var(--text-2xl);
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav {
  display: flex;
  gap: var(--space-8);
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.nav-link.active {
  color: var(--primary-color);
  background: rgba(59, 130, 246, 0.1);
}

.header-actions {
  display: flex;
  gap: var(--space-4);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.user-name {
  font-weight: 500;
  color: var(--text-primary);
}

/* 主要内容 */
.main-content {
  padding: var(--space-8) 0;
  animation: fadeIn var(--transition-slow);
}

/* 搜索栏 */
.search-section {
  background: var(--bg-primary);
  padding: var(--space-8);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--space-8);
}

.search-box {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.search-input {
  flex: 1;
  padding: var(--space-4) var(--space-6);
  font-size: var(--text-lg);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
}

.tag:hover {
  background: var(--border-default);
  color: var(--text-primary);
}

.tag.active {
  background: var(--primary-color);
  color: var(--text-inverse);
  border-color: var(--primary-color);
}

.tag-icon {
  font-size: var(--text-base);
}

/* 求购列表 */
.demands-section {
  animation: fadeIn var(--transition-slow);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
}

.section-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.select {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-base);
  color: var(--text-primary);
  background: var(--bg-primary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  cursor: pointer;
}

/* 加载状态 */
.loading-container {
  min-height: 400px;
}

.skeleton-loader {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-6);
}

.skeleton-card {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}

.skeleton-image {
  height: 120px;
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
}

.skeleton-title {
  height: 24px;
  margin-bottom: var(--space-3);
}

.skeleton-text {
  height: 16px;
  margin-bottom: var(--space-2);
  width: 100%;
}

.skeleton-text.short {
  width: 60%;
}

/* 求购卡片 */
.demands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.demand-card {
  cursor: pointer;
  transition: all var(--transition-base);
}

.demand-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.demand-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.demand-time {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.demand-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-3);
  line-height: 1.4;
}

.demand-description {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  line-height: 1.6;
  margin-bottom: var(--space-4);
  min-height: 48px;
}

.demand-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.meta-item .icon {
  font-size: var(--text-base);
}

.demand-user {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: var(--primary-gradient);
  color: var(--text-inverse);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: var(--text-sm);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: var(--space-16) var(--space-8);
}

.empty-icon {
  font-size: 80px;
  margin-bottom: var(--space-6);
}

.empty-state h3 {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.empty-state p {
  color: var(--text-secondary);
  font-size: var(--text-base);
  margin-bottom: var(--space-6);
}

/* 分页 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-8) 0;
}

.page-info {
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

/* 响应式 */
@media (max-width: 768px) {
  .nav {
    display: none;
  }
  
  .search-box {
    flex-direction: column;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-4);
  }
  
  .demands-grid {
    grid-template-columns: 1fr;
  }
}
</style>
