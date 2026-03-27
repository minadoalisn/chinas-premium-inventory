<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card card">
        <div class="stat-icon user">
          <i class="icon">👥</i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.userCount }}</div>
          <div class="stat-label">总用户数</div>
          <div class="stat-change positive">
            <i class="icon">📈</i>
            +{{ stats.userGrowth }}% 本月
          </div>
        </div>
      </div>

      <div class="stat-card card">
        <div class="stat-icon merchant">
          <i class="icon">🏪</i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.merchantCount }}</div>
          <div class="stat-label">商户数</div>
          <div class="stat-change positive">
            <i class="icon">📈</i>
            +{{ stats.merchantGrowth }}% 本月
          </div>
        </div>
      </div>

      <div class="stat-card card">
        <div class="stat-icon demand">
          <i class="icon">📋</i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.demandCount }}</div>
          <div class="stat-label">求购需求</div>
          <div class="stat-change positive">
            <i class="icon">📈</i>
            +{{ stats.demandGrowth }}% 本月
          </div>
        </div>
      </div>

      <div class="stat-card card">
        <div class="stat-icon product">
          <i class="icon">📦</i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.productCount }}</div>
          <div class="stat-label">库存商品</div>
          <div class="stat-change positive">
            <i class="icon">📈</i>
            +{{ stats.productGrowth }}% 本月
          </div>
        </div>
      </div>

      <div class="stat-card card">
        <div class="stat-icon order">
          <i class="icon">🛒</i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.orderCount }}</div>
          <div class="stat-label">订单数</div>
          <div class="stat-change positive">
            <i class="icon">📈</i>
            +{{ stats.orderGrowth }}% 本月
          </div>
        </div>
      </div>

      <div class="stat-card card">
        <div class="stat-icon revenue">
          <i class="icon">💰</i>
        </div>
        <div class="stat-content">
          <div class="stat-value">¥{{ formatPrice(stats.revenue) }}</div>
          <div class="stat-label">总收入</div>
          <div class="stat-change positive">
            <i class="icon">📈</i>
            +{{ stats.revenueGrowth }}% 本月
          </div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-grid">
      <!-- 订单趋势图 -->
      <div class="chart-card card">
        <div class="card-header">
          <h3 class="card-title">订单趋势</h3>
          <div class="card-actions">
            <select v-model="orderChartPeriod" @change="loadOrderChart" class="select">
              <option value="7">最近7天</option>
              <option value="30">最近30天</option>
              <option value="90">最近90天</option>
            </select>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-placeholder">
            <div class="chart-data">
              <div class="chart-bar" v-for="(item, index) in orderChartData" :key="index">
                <div class="bar" :style="{ height: (item.value / maxOrderValue * 100) + '%' }"></div>
                <div class="label">{{ item.label }}</div>
                <div class="value">{{ item.value }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 类目分布图 -->
      <div class="chart-card card">
        <div class="card-header">
          <h3 class="card-title">类目分布</h3>
        </div>
        <div class="card-body">
          <div class="category-chart">
            <div
              v-for="category in categoryData"
              :key="category.id"
              class="category-item"
            >
              <div class="category-info">
                <span class="category-icon">{{ category.icon }}</span>
                <span class="category-name">{{ category.name }}</span>
              </div>
              <div class="category-bar-container">
                <div
                  class="category-bar"
                  :style="{ width: (category.count / maxCategoryCount * 100) + '%' }"
                ></div>
              </div>
              <div class="category-count">{{ category.count }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="activity-section">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">最近活动</h3>
          <button @click="loadActivities" class="btn btn-ghost btn-sm">
            <i class="icon">🔄</i>
            刷新
          </button>
        </div>
        <div class="card-body">
          <div class="activity-list">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="activity-item"
            >
              <div class="activity-icon" :class="activity.type">
                <i class="icon">{{ getActivityIcon(activity.type) }}</i>
              </div>
              <div class="activity-content">
                <div class="activity-text">{{ activity.text }}</div>
                <div class="activity-time">{{ formatTime(activity.time) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 待处理事项 -->
    <div class="pending-section">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">待处理事项</h3>
        </div>
        <div class="card-body">
          <div class="pending-list">
            <div
              v-for="item in pendingItems"
              :key="item.id"
              class="pending-item"
            >
              <div class="pending-icon" :class="item.type">
                <i class="icon">{{ getPendingIcon(item.type) }}</i>
              </div>
              <div class="pending-content">
                <div class="pending-text">{{ item.text }}</div>
                <div class="pending-count">{{ item.count }} 条</div>
              </div>
              <button @click="handlePending(item)" class="btn btn-primary btn-sm">
                处理
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/api'

// 统计数据
const stats = ref({
  userCount: 0,
  userGrowth: 0,
  merchantCount: 0,
  merchantGrowth: 0,
  demandCount: 0,
  demandGrowth: 0,
  productCount: 0,
  productGrowth: 0,
  orderCount: 0,
  orderGrowth: 0,
  revenue: 0,
  revenueGrowth: 0,
})

// 图表数据
const orderChartPeriod = ref('7')
const orderChartData = ref<any[]>([])
const maxOrderValue = computed(() => Math.max(...orderChartData.value.map(d => d.value), 1))

const categoryData = ref<any[]>([])
const maxCategoryCount = computed(() => Math.max(...categoryData.value.map(d => d.count), 1))

// 最近活动
const recentActivities = ref<any[]>([])

// 待处理事项
const pendingItems = ref([
  { id: 1, type: 'merchant', text: '待审核商户', count: 5 },
  { id: 2, type: 'product', text: '待审核商品', count: 12 },
  { id: 3, type: 'inquiry', text: '待回复询盘', count: 8 },
  { id: 4, type: 'order', text: '待发货订单', count: 3 },
])

// 加载统计数据
const loadStats = async () => {
  try {
    const response = await api.stats.getDashboard()
    stats.value = response.data
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 加载订单趋势图
const loadOrderChart = async () => {
  try {
    const response = await api.stats.getOrderTrend(orderChartPeriod.value)
    orderChartData.value = response.data
  } catch (error) {
    console.error('加载订单趋势失败:', error)
  }
}

// 加载类目分布
const loadCategories = async () => {
  try {
    const response = await api.categories.findAll()
    categoryData.value = response.data.map((cat: any) => ({
      ...cat,
      count: Math.floor(Math.random() * 100), // 模拟数据
    }))
  } catch (error) {
    console.error('加载类目数据失败:', error)
  }
}

// 加载最近活动
const loadActivities = async () => {
  try {
    const response = await api.stats.getRecentActivities()
    recentActivities.value = response.data
  } catch (error) {
    console.error('加载最近活动失败:', error)
    // 模拟数据
    recentActivities.value = [
      { id: 1, type: 'user', text: '新用户注册: 张三', time: new Date() },
      { id: 2, type: 'merchant', text: '商户申请: 科技有限公司', time: new Date(Date.now() - 3600000) },
      { id: 3, type: 'order', text: '新订单: #12345', time: new Date(Date.now() - 7200000) },
      { id: 4, type: 'product', text: '新商品上架: iPhone 15', time: new Date(Date.now() - 10800000) },
    ]
  }
}

// 处理待处理事项
const handlePending = (item: any) => {
  console.log('处理待处理事项:', item)
  // 根据类型跳转到相应页面
}

// 工具方法
const formatPrice = (price: number) => {
  if (price >= 10000) {
    return `${(price / 10000).toFixed(1)}万`
  }
  return price.toLocaleString()
}

const formatTime = (time: Date) => {
  const date = new Date(time)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  return date.toLocaleDateString()
}

const getActivityIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    user: '👤',
    merchant: '🏪',
    order: '🛒',
    product: '📦',
    inquiry: '💬',
  }
  return iconMap[type] || '📌'
}

const getPendingIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    merchant: '🏪',
    product: '📦',
    inquiry: '💬',
    order: '🛒',
  }
  return iconMap[type] || '📌'
}

// 生命周期
onMounted(() => {
  loadStats()
  loadOrderChart()
  loadCategories()
  loadActivities()
})
</script>

<style scoped>
.dashboard {
  animation: fadeIn var(--transition-slow);
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-6);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.stat-icon.user {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.merchant {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.demand {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.product {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-icon.order {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-icon.revenue {
  background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-2);
}

.stat-change {
  font-size: var(--text-xs);
  color: var(--success-color);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.stat-change.negative {
  color: var(--error-color);
}

/* 图表区域 */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.chart-card {
  min-height: 400px;
}

.card-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding: var(--space-4);
  border: 1px dashed var(--border-light);
  border-radius: var(--radius-md);
}

.chart-data {
  display: flex;
  gap: var(--space-4);
  width: 100%;
  height: 100%;
  align-items: flex-end;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.bar {
  width: 40px;
  background: var(--primary-gradient);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  transition: height var(--transition-base);
}

.chart-bar .label {
  margin-top: var(--space-2);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.chart-bar .value {
  margin-bottom: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
}

/* 类目分布 */
.category-chart {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.category-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3);
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
}

.category-info {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.category-icon {
  font-size: var(--text-lg);
}

.category-name {
  font-size: var(--text-sm);
  color: var(--text-primary);
}

.category-bar-container {
  height: 8px;
  background: var(--bg-secondary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.category-bar {
  height: 100%;
  background: var(--primary-gradient);
  border-radius: var(--radius-full);
  transition: width var(--transition-base);
}

.category-count {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
  min-width: 40px;
  text-align: right;
}

/* 最近活动 */
.activity-section {
  margin-bottom: var(--space-8);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.activity-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-lg);
}

.activity-icon.user {
  background: rgba(59, 130, 246, 0.1);
  color: var(--primary-color);
}

.activity-icon.merchant {
  background: rgba(139, 92, 246, 0.1);
  color: var(--secondary-color);
}

.activity-icon.order {
  background: rgba(245, 158, 11, 0.1);
  color: var(--warning-color);
}

.activity-icon.product {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: var(--text-sm);
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.activity-time {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

/* 待处理事项 */
.pending-section {
  margin-bottom: var(--space-8);
}

.pending-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.pending-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--primary-color);
}

.pending-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-lg);
}

.pending-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pending-text {
  font-size: var(--text-sm);
  color: var(--text-primary);
}

.pending-count {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--primary-color);
  background: rgba(59, 130, 246, 0.1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
}

/* 响应式 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
