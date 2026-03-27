<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useDemandStore } from '@/stores/demand'
import { ElMessage } from 'element-plus'

const demandStore = useDemandStore()

const form = reactive({
  title: '',
  category: '',
  quantity: 100,
  unit: '件',
  budget: '',
  description: '',
  deliveryAddress: '',
  isUrgent: false,
})

const categories = ref([
  { id: '1', name: '小家电' },
  { id: '2', name: '电子产品' },
  { id: '3', name: '快消品' },
  { id: '4', name: '旅游用品' },
  { id: '5', name: '日用品' },
  { id: '6', name: '美妆' },
  { id: '7', name: '家居用品' },
  { id: '8', name: 'LED灯' },
  { id: '9', name: '家具' },
  { id: '10', name: '设备' },
  { id: '11', name: '原材料' },
  { id: '12', name: '五金建材' },
])

const submitting = ref(false)

const handleSubmit = async () => {
  submitting.value = true
  try {
    const res = await fetch('/api/demands', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Client-Type': 'domestic',
      },
      body: JSON.stringify(form),
    })

    if (res.success) {
      ElMessage.success('发布成功')
      demandStore.isCreateDialogVisible = false
      // 重置表单
      Object.assign(form, {
        title: '',
        category: '',
        quantity: 100,
        unit: '件',
        budget: '',
        description: '',
        deliveryAddress: '',
        isUrgent: false,
      })
    } else {
      ElMessage.error(res.message || '发布失败')
    }
  } catch (error) {
    console.error('Failed to create demand:', error)
    ElMessage.error('发布失败')
  } finally {
    submitting.value = false
  }
}

const handleClose = () => {
  demandStore.isCreateDialogVisible = false
}
</script>

<template>
  <el-dialog
    v-model="demandStore.isCreateDialogVisible"
    title="发布求购需求"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form label-width="100px">
      <el-form-item label="需求标题">
        <el-input
          v-model="form.title"
          placeholder="请输入求购商品名称"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="商品类目">
        <el-select
          v-model="form.category"
          placeholder="请选择类目"
          style="width: 100%"
        >
          <el-option
            v-for="cat in categories"
            :key="cat.id"
            :label="cat.name"
            :value="cat.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="求购数量">
        <el-input-number
          v-model="form.quantity"
          :min="1"
          :max="10000000"
          :step="100"
          style="width: 200px"
        />
        <el-select
          v-model="form.unit"
          style="width: 120px; margin-left: 12px"
        >
          <el-option label="件" value="件" />
          <el-option label="箱" value="箱" />
          <el-option label="台" value="台" />
          <el-option label="套" value="套" />
          <el-option label="个" value="个" />
          <el-option label="千克" value="千克" />
          <el-option label="吨" value="吨" />
        </el-select>
      </el-form-item>

      <el-form-item label="预算单价">
        <el-input
          v-model="form.budget"
          placeholder="例如：80-120元/件 或 面议"
        />
      </el-form-item>

      <el-form-item label="收货地址">
        <el-input
          v-model="form.deliveryAddress"
          placeholder="请输入收货地址"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="需求描述">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请详细描述您的需求，如商品规格、质量要求、包装要求等"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="是否加急">
        <el-switch v-model="form.isUrgent" />
        <span class="ml-2 text-gray-500 text-sm">加急需求会优先展示给商户</span>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button
        type="primary"
        :loading="submitting"
        @click="handleSubmit"
      >
        立即发布
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
</style>
