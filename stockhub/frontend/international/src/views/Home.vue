<template>
  <div class="home-page">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <img src="/logo.png" alt="StockHub" class="logo-img" @error="handleLogoError">
            <span class="brand-text">CNSURPR.COM</span>
          </div>
          <nav class="nav">
            <router-link to="/" class="nav-link active">Products</router-link>
            <router-link to="/orders.html" class="nav-link">My Orders</router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="container">
        <div class="hero-content">
          <div class="badge">🔥 Premium Products from China</div>
          <h1>Discover Amazing<br><span class="gradient-text">Inventory Deals</span></h1>
          <p>Direct from manufacturers at unbeatable prices. Premium quality guaranteed.</p>
          <div class="hero-stats">
            <div class="stat">
              <span class="stat-number">500+</span>
              <span class="stat-label">Products</span>
            </div>
            <div class="stat">
              <span class="stat-number">50+</span>
              <span class="stat-label">Suppliers</span>
            </div>
            <div class="stat">
              <span class="stat-number">100%</span>
              <span class="stat-label">Quality</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="main-content">
      <div class="container">
        <!-- Search Section -->
        <div class="search-section">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Search premium products..."
              @input="handleSearch"
              @keyup.enter="handleSearch"
            >
            <button @click="handleSearch" class="btn btn-primary">Search</button>
          </div>
          
          <!-- Category Filter -->
          <div class="filter-tags">
            <button
              v-for="category in categories"
              :key="category.id"
              @click="filterByCategory(category.id)"
              :class="['tag', { active: selectedCategory === category.id }]"
            >
              {{ category.icon }} {{ category.nameEn || category.name }}
            </button>
            <button
              @click="resetFilters"
              :class="['tag', { active: selectedCategory === null }]"
            >
              🌐 All Products
            </button>
          </div>
        </div>

        <!-- Products Grid -->
        <div v-if="loading" class="loading-container">
          <div class="skeleton-loader">
            <div v-for="i in 8" :key="i" class="skeleton-card"></div>
          </div>
        </div>

        <div v-else-if="products.length > 0" class="products-grid">
          <div
            v-for="product in products"
            :key="product.id"
            class="product-card"
            @click="viewDetail(product.id)"
          >
            <div class="product-badge hot" v-if="product.stock > 500">HOT DEAL</div>
            <div class="product-badge new" v-if="isNewProduct(product)">NEW</div>
            
            <div class="product-image">
              <div class="image-placeholder">
                {{ product.icon || '📦' }}
              </div>
              <div class="discount-badge" v-if="getDiscount(product) > 0">
                -{{ getDiscount(product) }}%
              </div>
            </div>
            
            <div class="product-info">
              <span class="product-category">{{ getCategoryName(product.categoryId) }}</span>
              <h3 class="product-title">{{ product.nameEn || product.name || 'Premium Product' }}</h3>
              <p class="product-desc">{{ (product.descriptionEn || product.description || '').substring(0, 80) }}...</p>
              
              <div class="product-pricing">
                <span class="current-price">${{ formatPrice(getCurrentPrice(product)) }}</span>
                <span class="original-price" v-if="getDiscount(product) > 0">${{ formatPrice(getOriginalPrice(product)) }}</span>
              </div>
              
              <div class="product-meta">
                <span class="stock">
                  <span class="stock-dot"></span>
                  {{ product.stock || 999 }} available
                </span>
                <span class="min-order">MOQ: {{ product.minOrderQuantity || 1 }}</span>
              </div>
              
              <button class="btn btn-primary btn-order" @click.stop="orderNow(product)">
                🛒 Order Now
              </button>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">📭</div>
          <h3>No products found</h3>
          <p>Check back later for new arrivals!</p>
          <button @click="resetFilters" class="btn btn-primary" style="margin-top:20px;">
            Browse All Products
          </button>
        </div>

        <!-- Pagination -->
        <div v-if="totalProducts > pageSize" class="pagination">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="btn btn-ghost"
          >
            ← Previous
          </button>
          <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="btn btn-ghost"
          >
            Next →
          </button>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <img src="/logo.png" alt="StockHub" class="footer-logo" @error="handleLogoError">
            <p>Premium inventory marketplace connecting global buyers with Chinese suppliers.</p>
          </div>
          <div class="footer-links">
            <div class="link-group">
              <h4>Quick Links</h4>
              <a href="/">Products</a>
              <a href="/orders.html">My Orders</a>
              <a href="/checkout.html">Checkout</a>
            </div>
            <div class="link-group">
              <h4>Support</h4>
              <a href="mailto:support@cnsurpr.com">Contact Us</a>
              <a href="#">FAQ</a>
              <a href="#">Shipping Info</a>
            </div>
            <div class="link-group">
              <h4>Contact</h4>
              <a href="mailto:support@cnsurpr.com">support@cnsurpr.com</a>
              <a href="tel:+8618026422225">+86 180 2642 2225</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 CNSURPR.COM. All rights reserved.</p>
          <div class="payment-methods">
            <span>💳 Visa</span>
            <span>💳 Mastercard</span>
            <span>💳 PayPal</span>
            <span>🔒 Secure</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const products = ref<any[]>([])
const categories = ref<any[]>([])
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref<number | null>(null)
const currentPage = ref(1)
const pageSize = ref(12)
const totalProducts = ref(0)

const totalPages = computed(() => Math.ceil(totalProducts.value / pageSize.value))

const loadProducts = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.append('page', currentPage.value.toString())
    params.append('limit', pageSize.value.toString())
    
    if (searchQuery.value) {
      params.append('search', searchQuery.value)
    }
    
    if (selectedCategory.value) {
      params.append('category', selectedCategory.value.toString())
    }

    const response = await fetch(`/api/products?${params}`)
    if (response.ok) {
      const data = await response.json()
      if (Array.isArray(data)) {
        products.value = data
        totalProducts.value = data.length
      } else {
        products.value = data.data || []
        totalProducts.value = data.total || 0
      }
    }
  } catch (error) {
    console.error('Failed to load products:', error)
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
    console.error('Failed to load categories:', error)
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadProducts()
}

const filterByCategory = (categoryId: number) => {
  selectedCategory.value = categoryId
  currentPage.value = 1
  loadProducts()
}

const resetFilters = () => {
  selectedCategory.value = null
  searchQuery.value = ''
  currentPage.value = 1
  loadProducts()
}

const changePage = (page: number) => {
  currentPage.value = page
  loadProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const viewDetail = (productId: number) => {
  window.location.href = `/product.html?id=${productId}`
}

const orderNow = (product: any) => {
  window.location.href = `/checkout.html?productId=${product.id}&quantity=${product.minOrderQuantity || 1}`
}

const getCategoryName = (categoryId: number) => {
  const cat = categories.value.find(c => c.id === categoryId)
  return cat ? (cat.nameEn || cat.name) : 'General'
}

const getCurrentPrice = (product: any) => {
  // 使用国际端价格（原价×5 或 一口价×3）
  return product.supplierPrice || (product.supplyPrice * 5) || 99
}

const getOriginalPrice = (product: any) => {
  // 原价是现价的1.5倍
  return getCurrentPrice(product) * 1.5
}

const getDiscount = (product: any) => {
  const current = getCurrentPrice(product)
  const original = getOriginalPrice(product)
  if (original <= current) return 0
  return Math.round((1 - current / original) * 100)
}

const formatPrice = (price: number) => {
  return price.toFixed(2)
}

const isNewProduct = (product: any) => {
  // 假设新商品是最近7天添加的
  const created = new Date(product.createdAt || Date.now())
  const now = new Date()
  const diff = now.getTime() - created.getTime()
  return diff < 7 * 24 * 60 * 60 * 1000
}

const handleImageError = (e: any) => {
  e.target.style.display = 'none'
}

const handleLogoError = (e: any) => {
  e.target.style.display = 'none'
}

onMounted(() => {
  loadCategories()
  loadProducts()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%);
  color: #fff;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.header {
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255,255,255,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-img {
  height: 40px;
  border-radius: 8px;
}

.brand-text {
  font-size: 1.3rem;
  font-weight: bold;
  background: linear-gradient(90deg, #e94560, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: #888;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  padding: 8px 0;
  border-bottom: 2px solid transparent;
}

.nav-link:hover, .nav-link.active {
  color: #fff;
  border-bottom-color: #e94560;
}

/* Hero */
.hero {
  position: relative;
  padding: 80px 0;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 50%, rgba(233,69,96,0.15) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(251,191,36,0.1) 0%, transparent 40%);
  pointer-events: none;
}

.hero-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.badge {
  display: inline-block;
  background: linear-gradient(90deg, rgba(233,69,96,0.2), rgba(251,191,36,0.2));
  border: 1px solid rgba(233,69,96,0.3);
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.hero h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(90deg, #e94560, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero p {
  font-size: 1.2rem;
  color: #888;
  max-width: 600px;
  margin: 0 auto 40px;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(90deg, #e94560, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  color: #888;
  font-size: 0.9rem;
}

/* Search Section */
.search-section {
  margin-bottom: 40px;
}

.search-box {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 15px;
  padding: 8px;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.search-box:focus-within {
  border-color: #e94560;
  box-shadow: 0 0 20px rgba(233,69,96,0.2);
}

.search-icon {
  padding: 0 15px;
  font-size: 1.2rem;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 12px;
  font-size: 1rem;
  color: #fff;
  outline: none;
}

.search-input::placeholder {
  color: #666;
}

.filter-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  padding: 10px 18px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 25px;
  color: #888;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.tag:hover {
  background: rgba(255,255,255,0.1);
  color: #fff;
}

.tag.active {
  background: linear-gradient(90deg, #e94560, #ff6b6b);
  border-color: #e94560;
  color: #fff;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.product-card {
  background: linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
  border-color: rgba(233,69,96,0.5);
  box-shadow: 0 20px 40px rgba(0,0,0,0.3),
              0 0 30px rgba(233,69,96,0.1);
}

.product-badge {
  position: absolute;
  top: 15px;
  padding: 5px 12px;
  border-radius: 5px;
  font-size: 0.75rem;
  font-weight: bold;
  z-index: 2;
}

.product-badge.hot {
  right: 15px;
  background: linear-gradient(90deg, #e94560, #ff6b6b);
  color: #fff;
}

.product-badge.new {
  left: 15px;
  background: #10b981;
  color: #fff;
}

.product-image {
  height: 200px;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.image-placeholder {
  font-size: 5rem;
}

.discount-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
  color: #000;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.85rem;
  font-weight: bold;
}

.product-info {
  padding: 20px;
}

.product-category {
  display: inline-block;
  background: rgba(233,69,96,0.2);
  color: #e94560;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  margin-bottom: 10px;
}

.product-title {
  margin: 0 0 8px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  line-height: 1.4;
}

.product-desc {
  margin: 0 0 15px;
  font-size: 0.85rem;
  color: #888;
  line-height: 1.5;
}

.product-pricing {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 12px;
}

.current-price {
  font-size: 1.8rem;
  font-weight: bold;
  color: #e94560;
}

.original-price {
  font-size: 1rem;
  color: #666;
  text-decoration: line-through;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 0.85rem;
  color: #888;
}

.stock {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #10b981;
}

.stock-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.min-order {
  color: #fbbf24;
}

.btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(90deg, #e94560, #ff6b6b);
  color: #fff;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(233,69,96,0.4);
}

.btn-order {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-ghost {
  background: rgba(255,255,255,0.05);
  color: #888;
  border: 1px solid rgba(255,255,255,0.1);
}

.btn-ghost:hover:not(:disabled) {
  background: rgba(255,255,255,0.1);
  color: #fff;
}

.btn-ghost:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 50px;
  padding-bottom: 50px;
}

.page-info {
  color: #888;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  margin: 0 0 10px;
  font-size: 1.5rem;
  color: #fff;
}

.empty-state p {
  color: #888;
}

/* Loading */
.loading-container {
  padding: 40px 0;
}

.skeleton-loader {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.skeleton-card {
  height: 400px;
  background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 20px;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Footer */
.footer {
  background: rgba(0,0,0,0.3);
  border-top: 1px solid rgba(255,255,255,0.1);
  padding: 60px 0 30px;
  margin-top: 50px;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 60px;
  margin-bottom: 40px;
}

.footer-brand {
  max-width: 300px;
}

.footer-logo {
  height: 40px;
  margin-bottom: 15px;
  border-radius: 8px;
}

.footer-brand p {
  color: #888;
  line-height: 1.6;
  font-size: 0.9rem;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.link-group h4 {
  color: #fff;
  margin-bottom: 20px;
  font-size: 1rem;
}

.link-group a {
  display: block;
  color: #888;
  text-decoration: none;
  margin-bottom: 12px;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.link-group a:hover {
  color: #e94560;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 30px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.footer-bottom p {
  color: #666;
  font-size: 0.9rem;
}

.payment-methods {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 0.85rem;
}

/* Responsive */
@media (max-width: 968px) {
  .hero h1 { font-size: 2.5rem; }
  .hero-stats { gap: 30px; }
  .stat-number { font-size: 2rem; }
  .footer-content { grid-template-columns: 1fr; gap: 40px; }
  .footer-links { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .container { padding: 0 16px; }
  .header-content { flex-direction: column; gap: 15px; }
  .nav { gap: 20px; }
  .hero { padding: 50px 0; }
  .hero h1 { font-size: 2rem; }
  .hero p { font-size: 1rem; }
  .hero-stats { flex-wrap: wrap; gap: 20px; }
  .products-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .product-info { padding: 15px; }
  .product-title { font-size: 0.95rem; }
  .current-price { font-size: 1.4rem; }
  .footer-links { grid-template-columns: 1fr; gap: 30px; }
  .footer-bottom { flex-direction: column; gap: 20px; text-align: center; }
}
</style>
