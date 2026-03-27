<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stats = ref({
  totalProducts: 156,
  published: 142,
  pending: 8,
  soldOut: 6,
})

const products = ref([
  {
    id: 'p001',
    title: '电饭煲 5L 智能家用电饭锅',
    stockQty: 5000,
    domesticPrice: 100,
    domesticCurrency: 'CNY',
    status: 'approved',
    createdAt: '2026-03-20',
    category: { name: '小家电' },
  },
  {
    id: 'p002',
    title: '蓝牙耳机 5.0 立体声耳机',
    stockQty: 3200,
    domesticPrice: 35,
    domesticCurrency: 'CNY',
    status: 'approved',
    createdAt: '2026-03-21',
    category: { name: '电子产品' },
  },
  {
    id: 'p003',
    title: '洗发水 750ml 强效去屑',
    stockQty: 0,
    domesticPrice: 15,
    domesticCurrency: 'CNY',
    status: 'approved',
    createdAt: '2026-03-22',
    category: { name: '快消品' },
  },
  {
    id: 'p004',
    title: '注塑机 200吨 全自动',
    stockQty: 2,
    domesticPrice: 500000,
    domesticCurrency: 'CNY',
    status: 'pending',
    createdAt: '2026-03-23',
    category: { name: '设备' },
  },
])

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const handleCreateProduct = () => {
  ElMessage.info('商品发布功能开发中...')
}

const handleEditProduct = (product: any) => {
  router.push(`/products/${product.id}/edit`)
}

const handleDeleteProduct = (product: any) => {
  ElMessage.info('商品下架功能开发中...')
}

const handleViewProduct = (productId: string) => {
  router.push(`/products/${productId}`)
}

onMounted(() => {
  // 加载统计数据和商品列表
})
</script>

<template>
  <div class="merchant-center">
    <div class="page-header">
      <h2>商户中心</h2>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-value">{{ stats.totalProducts }}</div>
          <div class="stat-label">总商品数</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card approved">
          <div class="stat-value">{{ stats.published }}</div>
          <div class="stat-label">已上架</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card pending">
          <div class="stat-value">{{ stats.pending }}</div>
          <div class="stat-label">审核中</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card sold-out">
          <div class="stat-value">{{ stats.soldOut }}</div>
          <div class="stat-label">已售罄</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 商品列表 -->
    <el-card class="products-card">
      <template #header>
        <div class="card-header">
          <span>我的商品</span>
          <el-button type="primary" size="small" @click="handleCreateProduct">
            <el-icon><Plus /></el-icon> 发布商品
          </el-button>
        </div>
      </template>

      <el-table :data="products" stripe style="width: 100%">
        <el-table-column prop="id" label="商品ID" width="100" />
        <el-table-column prop="title" label="商品名称" min-width="250" />
        <el-table-column prop="category.name" label="类目" width="120" />
        <el-table-column prop="stockQty" label="库存" width="100">
          <template #default="{ row }">
            <span :class="{ 'text-red-500': row.stockQty === 0, 'text-orange-500': row.stockQty < 10 }">
              {{ row.stockQty }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="domesticPrice" label="价格（元）" width="120">
          <template #default="{ row }">
            {{ row.domesticPrice.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.status === 'approved' ? 'success' : row.status === 'pending' ? 'warning' : 'info'"
              size="small"
            >
              {{ row.status === 'approved' ? '已上架' : row.status === 'pending' ? '审核中' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="120">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleViewProduct(row.id)">查看</el-button>
            <el-button size="small" type="primary" @click="handleEditProduct(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDeleteProduct(row)">下架</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.merchant-center {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
  padding: 20px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-card.approved {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-card.pending {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.stat-card.sold-out {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.stat-value {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.8;
}

.products-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
