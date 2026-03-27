<template>
  <div class="dialog-overlay" @click.self="handleClose">
    <div class="dialog-container">
      <div class="dialog-header">
        <h2 class="dialog-title">发布求购需求</h2>
        <button @click="handleClose" class="btn btn-ghost btn-close">
          <i class="icon">✕</i>
        </button>
      </div>
      
      <div class="dialog-body">
        <form @submit.prevent="handleSubmit" class="demand-form">
          <!-- 标题 -->
          <div class="form-group">
            <label class="form-label">
              求购标题 <span class="required">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              class="input"
              placeholder="例如：求购iPhone 15 Pro Max 256GB"
              required
              maxlength="100"
            >
            <div class="form-hint">{{ form.title.length }}/100</div>
          </div>
          
          <!-- 类目 -->
          <div class="form-group">
            <label class="form-label">
              商品类目 <span class="required">*</span>
            </label>
            <select v-model="form.categoryId" class="select" required>
              <option value="">请选择类目</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.icon }} {{ category.name }}
              </option>
            </select>
          </div>
          
          <!-- 数量和价格 -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                求购数量 <span class="required">*</span>
              </label>
              <input
                v-model.number="form.quantity"
                type="number"
                class="input"
                placeholder="10"
                min="1"
                required
              >
            </div>
            <div class="form-group">
              <label class="form-label">
                预算单价（元） <span class="required">*</span>
              </label>
              <input
                v-model.number="form.price"
                type="number"
                class="input"
                placeholder="6000"
                min="0"
                step="0.01"
                required
              >
            </div>
          </div>
          
          <!-- 描述 -->
          <div class="form-group">
            <label class="form-label">
              详细描述 <span class="required">*</span>
            </label>
            <textarea
              v-model="form.description"
              class="textarea"
              placeholder="详细描述您的求购需求，如品牌、型号、规格、成色要求等"
              rows="4"
              required
              maxlength="500"
            ></textarea>
            <div class="form-hint">{{ form.description.length }}/500</div>
          </div>
          
          <!-- 提示信息 -->
          <div class="alert alert-info">
            <i class="icon">ℹ️</i>
            <span>发布后系统将自动匹配符合要求的库存商品</span>
          </div>
          
          <!-- 操作按钮 -->
          <div class="form-actions">
            <button
              type="button"
              @click="handleClose"
              class="btn btn-ghost"
              :disabled="submitting"
            >
              取消
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="submitting || !isFormValid"
            >
              <span v-if="submitting" class="spinner"></span>
              {{ submitting ? '发布中...' : '发布需求' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/api'

const emit = defineEmits(['close', 'success'])

// 状态
const categories = ref<any[]>([])
const submitting = ref(false)

// 表单数据
const form = ref({
  title: '',
  categoryId: '',
  quantity: 1,
  price: 0,
  description: '',
})

// 计算属性
const isFormValid = computed(() => {
  return (
    form.value.title.trim().length > 0 &&
    form.value.categoryId &&
    form.value.quantity > 0 &&
    form.value.price >= 0 &&
    form.value.description.trim().length > 0
  )
})

// 方法
const loadCategories = async () => {
  try {
    const response = await api.categories.findAll()
    categories.value = response.data
  } catch (error) {
    console.error('加载类目失败:', error)
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  submitting.value = true
  try {
    await api.demands.create(form.value)
    emit('success')
    // 重置表单
    form.value = {
      title: '',
      categoryId: '',
      quantity: 1,
      price: 0,
      description: '',
    }
  } catch (error) {
    console.error('发布求购失败:', error)
  } finally {
    submitting.value = false
  }
}

const handleClose = () => {
  emit('close')
}

// 生命周期
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  animation: fadeIn var(--transition-base);
}

.dialog-container {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  animation: scaleIn var(--transition-base);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6);
  border-bottom: 1px solid var(--border-light);
}

.dialog-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
}

.btn-close {
  padding: var(--space-2);
  min-width: auto;
}

.dialog-body {
  padding: var(--space-6);
  overflow-y: auto;
  max-height: calc(90vh - 80px);
}

.demand-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
}

.form-label {
  font-weight: 500;
  color: var(--text-primary);
  font-size: var(--text-sm);
}

.required {
  color: var(--error-color);
}

.form-hint {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  text-align: right;
}

.textarea {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
  color: var(--text-primary);
  background: var(--bg-primary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  resize: vertical;
  font-family: inherit;
  transition: all var(--transition-base);
}

.textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-light);
}

/* 响应式 */
@media (max-width: 640px) {
  .dialog-container {
    width: 100%;
    height: 100%;
    max-height: 100%;
    border-radius: 0;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
