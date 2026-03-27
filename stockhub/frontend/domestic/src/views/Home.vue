<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useDemandStore } from '@/stores/demand'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const demandStore = useDemandStore()
const authStore = useAuthStore()
const router = useRouter()

const loading = ref(false)
const searchForm = ref({
  keyword: '',
  category: '',
  sort: 'newest', // newest, quantity, price
})

const statistics = ref({
  todayDemands: 12580,
  todayVolume: 230000000,
  onlineMerchants: 8650,
  stockProducts: 1560000,
})

const categories = ref([
  { id: '1', name: '小家电', count: 1280, color: 'red' },
  { id: '2', name: '电子产品', count: 856, color: 'blue' },
  { id: '3', name: '快消品', count: 1450, color: 'green' },
  { id: '4', name: '旅游用品', count: 680, color: 'yellow' },
  { id: '5', name: '日用品', count: 920, color: 'yellow' },
  { id: '6', name: '美妆', count: 680, color: 'purple' },
  { id: '7', name: '家居用品', count: 750, color: 'pink' },
  { id: '8', name: 'LED灯', count: 540, color: 'orange' },
  { id: '9', name: '家具', count: 420, color: 'indigo' },
  { id: '10', name: '设备', count: 380, color: 'purple' },
  { id: '11', name: '原材料', count: 560, color: 'teal' },
  { id: '12', name: '五金建材', count: 650, color: 'gray' },
])

// 获取求购列表
const fetchDemands = async () => {
  loading.value = true
  try {
    const params: any = {
      page: 1,
      limit: 20,
    }

    if (searchForm.value.keyword) {
      params.search = searchForm.value.keyword
    }

    if (searchForm.value.category) {
      params.category = searchForm.value.category
    }

    if (searchForm.value.sort) {
      params.sort = searchForm.value.sort
    }

    const res = await fetch(`/api/demands?${new URLSearchParams(params)}`)
    if (res.success) {
      demandStore.demandList = res.data.data
    }
  } catch (error) {
    console.error('Failed to fetch demands:', error)
    ElMessage.error('获取求购列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  fetchDemands()
}

// 按类目筛选
const filterByCategory = (categoryId: string) => {
  searchForm.value.category = categoryId
  fetchDemands()
}

// 排序切换
const handleSort = (sort: string) => {
  searchForm.value.sort = sort
  fetchDemands()
}

// 打开创建求购弹窗
const openCreateDialog = () => {
  if (!authStore.isAuthenticated) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  demandStore.isCreateDialogVisible = true
}

// 点击"我有库存"
const handleHaveStock = (demand: any) => {
  if (!authStore.isAuthenticated) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  ElMessage.success('已联系商户，等待对方确认')
}

// 收藏需求
const handleCollectDemand = (demand: any) => {
  if (!authStore.isAuthenticated) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  ElMessage.success('已收藏')
}

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 100000000) {
    return `¥${(num / 100000000).toFixed(1)}亿`
  }
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`
  }
  return num.toString()
}

// 格式化时间
const formatTime = (time: string) => {
  const diff = Date.now() - new Date(time).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  return `${Math.floor(hours / 24)}天前`
}

// 获取状态标签
const getStatusBadge = (demand: any) => {
  if (demand.isUrgent) {
    return { text: '加急', color: 'red' }
  }
  if (demand.type === 'near-expiry') {
    return { text: '临期清仓', color: 'yellow' }
  }
  if (demand.type === 'equipment') {
    return { text: '设备采购', color: 'purple' }
  }
  return { text: '优质采购', color: 'green' }
}

// 获取类目标签颜色
const getCategoryColor = (color: string) => {
  const colors: Record<string, string> = {
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    pink: 'bg-pink-100 text-pink-600',
    orange: 'bg-orange-100 text-orange-600',
    teal: 'bg-teal-100 text-teal-600',
    gray: 'bg-gray-100 text-gray-600',
  }
  return colors[color] || 'bg-blue-100 text-blue-600'
}

onMounted(() => {
  fetchDemands()
})
</script>

<template>
  <div class="home-page">
    <!-- 统计数据栏 -->
    <div class="gradient-header text-white py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-4 gap-4 text-center">
          <div>
            <div class="text-2xl font-bold">{{ statistics.todayDemands.toLocaleString() }}</div>
            <div class="text-sm opacity-80">今日求购</div>
          </div>
          <div>
            <div class="text-2xl font-bold">{{ formatNumber(statistics.todayVolume) }}</div>
            <div class="text-sm opacity-80">今日成交额</div>
          </div>
          <div>
            <div class="text-2xl font-bold">{{ statistics.onlineMerchants.toLocaleString() }}</div>
            <div class="text-sm opacity-80">在线商户</div>
          </div>
          <div>
            <div class="text-2xl font-bold">{{ formatNumber(statistics.stockProducts) }}</div>
            <div class="text-sm opacity-80">库存商品</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索筛选区 -->
    <div class="bg-white shadow-sm py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-4">
          <div class="flex-1 relative">
            <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="searchForm.keyword"
              type="text"
              placeholder="搜索求购商品、类目、规格..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              @keyup.enter="handleSearch"
            />
          </div>
          <select
            v-model="searchForm.category"
            class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            @change="handleSearch"
          >
            <option value="">全部类目</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
          <button
            class="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition"
            @click="handleSearch"
          >
            搜索求购
          </button>
        </div>

        <!-- 热门类目 -->
        <div class="mt-6">
          <h3 class="text-sm font-medium text-gray-600 mb-3">热门类目：</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="cat in categories"
              :key="cat.id"
              class="category-badge px-3 py-1 rounded-full text-sm cursor-pointer transition-all"
              :class="getCategoryColor(cat.color)"
              @click="filterByCategory(cat.id)"
            >
              <i class="ri-fire-line mr-1" v-if="cat.color === 'red'"></i>
              {{ cat.name }} ({{ cat.count }})
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 求购列表 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-900">最新求购需求</h2>
        <div class="flex space-x-4 text-sm">
          <button
            :class="searchForm.sort === 'newest' ? 'text-purple-600 font-medium' : 'text-gray-600 hover:text-purple-600'"
            @click="handleSort('newest')"
          >
            最新发布
          </button>
          <button
            :class="searchForm.sort === 'quantity' ? 'text-purple-600 font-medium' : 'text-gray-600 hover:text-purple-600'"
            @click="handleSort('quantity')"
          >
            数量最多
          </button>
          <button
            :class="searchForm.sort === 'price' ? 'text-purple-600 font-medium' : 'text-gray-600 hover:text-purple-600'"
            @click="handleSort('price')"
          >
            价格最高
          </button>
        </div>
      </div>

      <div v-loading="loading" class="grid gap-4">
        <div
          v-for="demand in demandStore.demandList"
          :key="demand.id"
          class="bg-white rounded-xl shadow-sm p-6 card-hover transition duration-300"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-3">
                <span
                  class="px-2 py-1 rounded text-xs font-medium"
                  :class="getCategoryColor(getStatusBadge(demand).color)"
                >
                  {{ getStatusBadge(demand).text }}
                </span>
                <span class="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                  {{ demand.category?.name }}
                </span>
                <span class="text-gray-400 text-xs">{{ formatTime(demand.createdAt) }}前发布</span>
                <span class="pulse-dot w-2 h-2 bg-green-500 rounded-full"></span>
                <span class="text-green-600 text-xs">在线采购</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ demand.title }}
              </h3>
              <p class="text-gray-600 text-sm mb-3">
                {{ demand.description }}
              </p>
              <div class="flex items-center space-x-6 text-sm">
                <div class="flex items-center">
                  <i class="ri-shopping-basket-line text-purple-600 mr-1"></i>
                  <span class="text-gray-600">求购数量：</span>
                  <span class="font-semibold text-gray-900 ml-1">{{ demand.quantity }} {{ demand.unit }}</span>
                </div>
                <div class="flex items-center">
                  <i class="ri-money-cny-circle-line text-green-600 mr-1"></i>
                  <span class="text-gray-600">预算单价：</span>
                  <span class="font-semibold text-green-600 ml-1">{{ demand.budget }}</span>
                </div>
                <div class="flex items-center">
                  <i class="ri-map-pin-line text-blue-600 mr-1"></i>
                  <span class="text-gray-600">收货地：</span>
                  <span class="text-gray-900 ml-1">{{ demand.deliveryAddress }}</span>
                </div>
              </div>
            </div>
            <div class="flex flex-col items-end space-y-3">
              <button
                class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                @click="handleHaveStock(demand)"
              >
                <i class="ri-hand-heart-line mr-1"></i>我有库存
              </button>
              <button
                class="border border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition"
                @click="handleCollectDemand(demand)"
              >
                <i class="ri-star-line mr-1"></i>收藏需求
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <el-empty
          v-if="!loading && demandStore.demandList.length === 0"
          description="暂无求购需求"
        />
      </div>

      <!-- 加载更多 -->
      <div class="text-center mt-8" v-if="demandStore.demandList.length > 0">
        <button
          class="bg-white border border-purple-600 text-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition"
          @click="fetchDemands"
        >
          <i class="ri-refresh-line mr-2"></i>加载更多求购
        </button>
      </div>
    </div>

    <!-- 创建求购弹窗 -->
    <CreateDemandDialog v-if="demandStore.isCreateDialogVisible" />
  </div>
</template>

<style scoped>
.home-page {
  min-height: calc(100vh - 60px);
  background: #f9fafb;
}

.gradient-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.category-badge {
  transition: all 0.3s ease;
}

.category-badge:hover {
  transform: scale(1.05);
}

.pulse-dot {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
