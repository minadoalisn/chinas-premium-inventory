<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElCard, ElRow, ElCol, ElTag, ElButton, ElDescriptions, ElDescriptionsItem, ElTable, ElDialog } from 'element-plus'
import type { UploadProps } from 'element-plus'

const route = useRoute()
const router = useRouter()

const productId = ref('')
const product = ref<any>(null)
const loading = ref(false)
const images = ref<string[]>([])
const similarProducts = ref<any[]>([])
const showImageDialog = ref(false)
const currentImageIndex = ref(0)

// 获取商品详情
const fetchProductDetail = async () => {
  productId.value = route.params.id as string
  loading.value = true
  try {
    const res = await fetch(`/api/products/${productId.value}`)
    if (res.ok) {
      const data = await res.json()
      product.value = data
      if (data?.images && Array.isArray(data.images)) {
        images.value = data.images
      }
    }
  } catch (error) {
    console.error('获取商品详情失败:', error)
    ElMessage.error('获取商品详情失败')
  } finally {
    loading.value = false
  }
}

// 获取相似商品
const fetchSimilarProducts = async () => {
  if (!productId.value) return
  try {
    const res = await fetch(`/api/products/${productId.value}/similar`)
    if (res.ok) {
      const data = await res.json()
      similarProducts.value = data || []
    }
  } catch (error) {
    console.error('获取相似商品失败:', error)
  }
}

// 获取类目名称
const getCategoryName = (categoryId: number) => {
  const cat = categories.value.find(c => c.id === categoryId)
  return cat ? cat.name : ''
}

// 格式化价格
const formatPrice = (price: number) => {
  if (!price) return '面议'
  return `¥${Number(price).toLocaleString()}`
}

// 打开图片预览
const openImageDialog = (index: number) => {
  currentImageIndex.value = index
  showImageDialog.value = true
}

// 查看大图
const viewLarge = () => {
  window.open(images.value[currentImageIndex.value], '_blank')
}

// 关闭图片预览
const closeImageDialog = () => {
  showImageValue.value = false
  currentImageIndex.value = 0
}

onMounted(() => {
  fetchProductDetail()
  fetchSimilarProducts()
})
</script>

<template>
  <div class="product-detail-page">
    <!-- 返回按钮 -->
    <div class="back-button">
      <el-button @click="router.push('/products')">
        <el-icon><ArrowLeft /></el-icon>
        返回列表
      </el-button>
    </div>

    <div v-loading="loading" class="content">
      <div v-if="product">
        <!-- 基本信息 -->
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <span class="title">基本信息</span>
              <el-tag v-if="product.status === 'approved'" type="success" size="small">已上架</el-tag>
              <el-tag v-else-if="product.status === 'pending'" type="warning" size="small">待审核</el-tag>
              <el-tag v-else-if="product.status === 'rejected'" type="info" size="small">已拒绝</el-tag>
            </div>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="商品标题">
              <span class="text">{{ product.title }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="商品描述">
              <span class="text">{{ product.description || '暂无描述' }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="商品类目">
              <el-tag>{{ getCategoryName(product.categoryId) }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="国内价格">
              <span class="price">{{ formatPrice(Number(product.priceDomestic)) }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="国际价格">
              <span class="price">${ formatPrice(Number(product.priceInternational)) }</span>
            </el-descriptions-item>
            <el-descriptions-item label="库存数量">
              <span class="text">{{ product.stockQty }} 件</span>
            </el-descriptions-item>
            <el-descriptions-item label="最小起订量">
              <span class="text">{{ product.minOrderQty }} 件</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 商品图片 -->
        <el-card class="images-card">
          <template #header>
            <span class="title">商品图片</span>
            <el-tag size="small">{{ images.length }}张</el-tag>
          </template>
          <div class="images-grid" v-if="images.length > 0">
            <div
              v-for="(img, index) in images"
              :key="index"
              class="image-item"
              @click="openImageDialog(index)"
            >
              <el-image
                :src="img"
                fit="cover"
                lazy
                :preview-src="img"
                :z-index="100"
              >
                <template #placeholder>
                  <el-icon :size="40" color="#c0c4cc"><Picture /></el-icon>
                </template>
              </el-image>
            </div>
          </div>
          <el-empty v-else description="暂无图片" />
        </el-card>

        <!-- 商品规格 -->
        <el-card class="specs-card" v-if="product.specifications">
          <template #header>
            <span class="title">商品规格</span>
          </template>
          <div class="specs-content">
            <div v-if="product.specifications">
              <pre class="specs-text">{{ product.specifications }}</pre>
            </div>
            <el-empty v-else description="暂无规格信息" />
          </div>
        </el-card>

        <!-- 相似商品 -->
        <el-card class="similar-card" v-if="similarProducts.length > 0">
          <template #header>
            <span class="title">相似商品</span>
          </template>
          <el-row :gutter="20">
            <el-col :span="12" v-for="item in similarProducts" :key="item.id">
              <el-card :body-style="{ padding: '12px' }" class="similar-item">
                <div class="similar-image">
                  <el-image
                    :src="item.images?.[0] || ''"
                    fit="cover"
                    lazy
                  />
                </div>
                <h4>{{ item.title }}</h4>
                <p class="price">¥{{ Number(item.priceDomestic).toLocaleString() }}</p>
                <p class="stock">库存: {{ item.stockQty }} 件</p>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </div>

    <!-- 图片预览弹窗 -->
    <el-dialog
      v-model="showImageDialog"
      :src="images[currentImageIndex]"
      :z-index="9999"
      fit="contain"
      append-to-body
    >
      <template #footer>
        <div class="preview-footer">
          <el-button @click="viewLarge">
            <el-icon><ZoomIn /></el-icon>
            查看大图
          </el-button>
          <el-button @click="closeImageDialog">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.product-detail-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.back-button {
  margin-bottom: 20px;
}

.content {
  opacity: 1;
  transition: opacity 0.3s;
}

.content[v-loading] {
  opacity: 0.5;
}

.info-card,
.images-card,
.specs-card,
.similar-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 16px;
  font-weight: 600;
  margin-right: 8px;
}

.text {
  color: #666;
  line-height: 1.6;
}

.price {
  color: #f56c6c;
  font-weight: 600;
  font-size: 16px;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.image-item {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
}

.image-item :deep(.el-image) {
  width: 100%;
  height: 200px;
  display: block;
}

.specs-text {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 13px;
  white-space: pre-wrap;
  overflow-x: auto;
  max-height: 300px;
}

.similar-item {
  cursor: pointer;
}

.similar-image {
  height: 100px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
}

.similar-image :deep(.el-image) {
  width: 100%;
  height: 100%;
  display: block;
}

.similar-item h4 {
  margin: 0 0 4px;
  font-size: 14px;
}

.similar-item .price {
  color: #f56c6c;
  font-weight: 600;
}

.similar-item .stock {
  color: #666;
  font-size: 12px;
}

.preview-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
