<template>
  <div class="product-detail-page">
    <div class="container">
      <button @click="$router.back()" class="btn btn-ghost">
        ← Back to Products
      </button>

      <div v-if="loading" class="loading">Loading...</div>

      <div v-else-if="product" class="product-content">
        <div class="product-gallery">
          <div class="main-image">
            <img
              :src="currentImage || '/placeholder.png'"
              :alt="product.titleEn"
              @error="handleImageError"
            >
          </div>
          <div class="thumbnail-list" v-if="product.images?.length > 1">
            <img
              v-for="(img, index) in product.images"
              :key="index"
              :src="img"
              :class="['thumbnail', { active: currentImage === img }]"
              @click="currentImage = img"
              @error="handleThumbnailError($event, index)"
            >
          </div>
        </div>

        <div class="product-info">
          <h1 class="product-title">{{ product.titleEn || product.title }}</h1>
          <p class="product-category">
            {{ getCategoryName(product.categoryId) }}
          </p>
          <p class="product-description">
            {{ product.descriptionEn || product.description }}
          </p>
          
          <div class="product-specs" v-if="product.specifications">
            <h3>Specifications</h3>
            <pre>{{ formatSpecs(product.specifications) }}</pre>
          </div>

          <div class="product-stock">
            <span class="stock-label">In Stock:</span>
            <span class="stock-value">{{ product.stockQty }} pieces</span>
          </div>

          <div class="product-actions">
            <button class="btn btn-primary btn-lg" @click="handleInquiry">
              Make Inquiry
            </button>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <h3>Product not found</h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const product = ref<any>(null)
const loading = ref(true)
const currentImage = ref('')
const categories = ref<any[]>([])

const loadProduct = async () => {
  loading.value = true
  try {
    const response = await fetch(`/api/products/${route.params.id}`)
    if (response.ok) {
      const data = await response.json()
      product.value = data
      currentImage.value = data.images?.[0] || ''
    }
  } catch (error) {
    console.error('加载商品失败:', error)
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const response = await fetch('/api/categories')
    if (response.ok) {
      categories.value = await response.json()
    }
  } catch (error) {
    console.error('加载类目失败:', error)
  }
}

const getCategoryName = (categoryId: number) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.nameEn : 'Uncategorized'
}

const formatSpecs = (specs: any) => {
  if (typeof specs === 'string') {
    return specs
  }
  return JSON.stringify(specs, null, 2)
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/placeholder.png'
}

const handleThumbnailError = (e: Event, index: number) => {
  const img = e.target as HTMLImageElement
  if (index === 0) {
    img.src = '/placeholder.png'
  } else {
    img.style.display = 'none'
  }
}

const handleInquiry = () => {
  alert('Inquiry feature coming soon!')
}

onMounted(() => {
  loadProduct()
  loadCategories()
})
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  padding: 2rem 0;
  background: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-ghost {
  background: transparent;
  color: #667eea;
  border: 1px solid #667eea;
}

.btn-ghost:hover {
  background: #f0f4ff;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.loading {
  text-align: center;
  padding: 4rem 0;
  font-size: 1.125rem;
  color: #666;
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-gallery {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image {
  flex: 1;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  min-height: 400px;
}

.thumbnail-list {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
}

.thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.3s;
}

.thumbnail.active {
  border-color: #667eea;
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-title {
  margin: 0 0 0.5rem;
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
}

.product-category {
  margin: 0 0 1rem;
  font-size: 1rem;
  color: #667eea;
  font-weight: 500;
}

.product-description {
  margin: 0 0 2rem;
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
}

.product-specs {
  margin: 0 0 2rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
}

.product-specs h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
  color: #1a1a1a;
}

.product-specs pre {
  margin: 0;
  font-size: 0.875rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.product-stock {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f0fdf4;
  border-radius: 8px;
}

.stock-label {
  font-size: 1rem;
  color: #1a1a1a;
}

.stock-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #10b981;
}

.product-actions {
  margin-top: auto;
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #666;
}

@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
  }
}
</style>
