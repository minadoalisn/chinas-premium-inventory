<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElCard, ElRow, ElCol, ElSelect, ElInput, ElButton, ElTag, ElPagination } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

// 表单数据
const searchForm = ref({
  keyword: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  page: 1,
  limit: 20,
})

const loading = ref(false)
const products = ref([])
const total = ref(0)
const categories = ref([])

// 获取类目列表
const fetchCategories = async () => {
  try {
    const res = await fetch('/api/categories')
    if (res.ok) {
      const data = await res.json()
      categories.value = data || []
    }
  } catch (error) {
    console.error('获取类目失败:', error)
    ElMessage.error('获取类目失败')
  }
}

// 搜索商品
const searchProducts = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (searchForm.value.keyword) params.append('search', searchForm.value.keyword)
    if (searchForm.value.category) params.append('category', searchForm.value.category)
    if (searchForm.value.minPrice) params.append('minPrice', searchForm.value.minPrice)
    if (searchForm.value.maxPrice) params.append('maxPrice', searchForm.value.maxPrice)
    params.append('page', searchForm.value.page)
    params.append('limit', searchForm.value.limit)

    const res = await fetch(`/api/products?${params}`)
    if (res.ok) {
      const data = await res.json()
      products.value = data?.data || []
      total.value = data?.meta?.total || 0
    }
  } catch (error) {
    console.error('搜索商品失败:', error)
    ElMessage.error('搜索商品失败')
  } finally {
    loading.value = false
  }
}

// 分页
const handleCurrentChange = (page: number) => {
  searchForm.value.page = page
  searchProducts()
}

const handleSizeChange = (size: number) => {
  searchForm.value.limit = size
  searchForm.value.page = 1
  searchProducts()
}

// 创建商品
const goToCreate = () => {
  router.push('/products/create')
}

// 查看详情
const goToDetail = (id: string) => {
  router.push(`/products/${id}`)
}

// 我有货源
const goToSupply = () => {
  const token = localStorage.getItem('token')
  if (token) {
    router.push('/merchant-center')
  } else {
    router.push('/login')
  }
}

// 格式化价格
const formatPrice = (price: number) => {
  if (!price) return '面议'
  return `¥${Number(price).toLocaleString()}`
}

onMounted(() => {
  fetchCategories()
  searchProducts()
})
</script>

<template>
  <div class="products-page">
    <div class="page-header">
      <h2>采购需求</h2>
      <div class="header-tip">
        平台采购需求列表，供应商可点击"我有货源"进行供货
      </div>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索商品名称、描述"
            clearable
            @keyup.enter="searchProducts"
          />
        </el-form-item>
        <el-form-item label="类目">
          <el-select
            v-model="searchForm.category"
            placeholder="选择类目"
            clearable
            @change="searchProducts"
          >
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.slug"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchProducts">
            搜索
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 商品列表 -->
    <el-card class="products-card">
      <div v-loading="loading" class="products-list">
        <div v-if="products.length === 0" class="empty">
          <el-empty description="暂无商品" />
        </div>
        
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="product in products" :key="product.id">
            <el-card :body-style="{ padding: '12px' }" class="product-card">
              <div class="product-image">
                <el-image
                  :src="product.images?.[0] || ''"
                  fit="cover"
                  lazy
                >
                  <template #placeholder>
                    <el-icon :size="50" color="#c0c4cc"><Picture /></el-icon>
                  </template>
                </el-image>
              </div>
              <div class="product-info">
                <h3 class="product-title">{{ product.title }}</h3>
                <p class="product-category">
                  <el-tag>{{ getCategoryName(product.categoryId) }}</el-tag>
                </p>
                <p class="product-spec">
                  <span class="spec-item">规格: {{ product.specifications || '-' }}</span>
                  <span class="spec-item">颜色: {{ product.color || '-' }}</span>
                </p>
                <p class="product-stock">
                  库存: {{ product.stockQty }} 件
                </p>
              </div>
              <div>
                <el-button type="primary" size="small" @click="goToSupply">
                  📦 我有货源
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-pagination
          v-model:current-page="searchForm.page"
          :current-page="searchForm.page"
          :page-size="searchForm.limit"
          :total="total"
          layout="total, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.products-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
}

.search-card {
  margin-bottom: 20px;
}

.products-list {
  min-height: 400px;
}

.empty {
  padding: 60px 0;
  text-align: center;
}

.product-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
  height: 150px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
}

.product-image :deep(.el-image) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-info h3 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
}

.product-category {
  margin: 0 0 8px;
}

.product-category .el-tag {
  margin-right: 8px;
}

.product-spec {
  display: flex;
  gap: 12px;
  margin: 8px 0;
  font-size: 14px;
  color: #606266;
}

.spec-item {
  display: inline-block;
}

.product-stock {
  margin: 8px 0;
  font-size: 14px;
  color: #409eff;
  font-weight: 500;
}

.product-desc {
  color: #666;
  font-size: 13px;
  line-height: 1.4;
  max-height: 40px;
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
}

.product-card .card {
  display: flex;
  flex-direction: column;
}

.product-card .card-body {
  flex: 1;
  padding: 0;
}

.product-info {
  flex: 1;
}

.product-info p {
  margin: 0 0 8px;
}
</style>
