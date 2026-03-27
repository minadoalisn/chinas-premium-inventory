<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDemandStore } from '@/stores/demand'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'

const demandStore = useDemandStore()

const loading = ref(false)
const dialogVisible = ref(false)
const editFormRef = ref<FormInstance>()
const currentDemand = ref<any>(null)

const editForm = reactive({
  id: '',
  title: '',
  category: '',
  quantity: 0,
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

// 获取我的求购列表
const fetchMyDemands = async () => {
  loading.value = true
  try {
    const res = await fetch('/api/demands/my', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Client-Type': 'domestic',
      },
    })

    if (res.success) {
      demandStore.demandList = res.data.data
    }
  } catch (error) {
    console.error('Failed to fetch my demands:', error)
    ElMessage.error('获取求购列表失败')
  } finally {
    loading.value = false
  }
}

// 打开创建弹窗
const openCreateDialog = () => {
  demandStore.isCreateDialogVisible = true
}

// 打开编辑弹窗
const openEditDialog = (demand: any) => {
  currentDemand.value = demand
  Object.assign(editForm, {
    id: demand.id,
    title: demand.title,
    category: demand.category?.id || '',
    quantity: demand.quantity,
    unit: demand.unit,
    budget: demand.budget,
    description: demand.description,
    deliveryAddress: demand.deliveryAddress,
    isUrgent: demand.isUrgent,
  })
  dialogVisible.value = true
}

// 更新求购
const handleUpdate = async () => {
  if (!editFormRef.value) return

  try {
    await editFormRef.value.validate()

    const res = await fetch(`/api/demands/${editForm.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Client-Type': 'domestic',
      },
      body: JSON.stringify(editForm),
    })

    if (res.success) {
      ElMessage.success('更新成功')
      dialogVisible.value = false
      fetchMyDemands()
    } else {
      ElMessage.error(res.message || '更新失败')
    }
  } catch (error) {
    console.error('Failed to update demand:', error)
    ElMessage.error('更新失败')
  }
}

// 删除求购
const handleDelete = (demand: any) => {
  ElMessageBox.confirm(
    `确定要删除求购"${demand.title}"吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      const res = await fetch(`/api/demands/${demand.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'X-Client-Type': 'domestic',
        },
      })

      if (res.success) {
        ElMessage.success('删除成功')
        fetchMyDemands()
      } else {
        ElMessage.error(res.message || '删除失败')
      }
    } catch (error) {
      console.error('Failed to delete demand:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    // 用户取消
  })
}

// 格式化时间
const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}

onMounted(() => {
  fetchMyDemands()
})
</script>

<template>
  <div class="my-demands-page">
    <div class="page-header">
      <h2>我的求购需求</h2>
      <el-button type="primary" @click="openCreateDialog">
        <el-icon><Plus /></el-icon>
        发布新求购
      </el-button>
    </div>

    <div v-loading="loading" class="demands-list">
      <div
        v-for="demand in demandStore.demandList"
        :key="demand.id"
        class="demand-card"
      >
        <div class="demand-header">
          <div class="demand-title">{{ demand.title }}</div>
          <div class="demand-tags">
            <el-tag v-if="demand.isUrgent" type="danger" size="small">加急</el-tag>
            <el-tag type="info" size="small">{{ demand.category?.name }}</el-tag>
          </div>
        </div>

        <div class="demand-body">
          <p class="description">{{ demand.description }}</p>

          <div class="info-grid">
            <div class="info-item">
              <span class="label">求购数量：</span>
              <span class="value">{{ demand.quantity }} {{ demand.unit }}</span>
            </div>
            <div class="info-item">
              <span class="label">预算单价：</span>
              <span class="value">{{ demand.budget }}</span>
            </div>
            <div class="info-item">
              <span class="label">收货地：</span>
              <span class="value">{{ demand.deliveryAddress }}</span>
            </div>
            <div class="info-item">
              <span class="label">发布时间：</span>
              <span class="value">{{ formatTime(demand.createdAt) }}</span>
            </div>
          </div>
        </div>

        <div class="demand-actions">
          <el-button size="small" @click="openEditDialog(demand)">
            <el-icon><Edit /></el-icon> 编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(demand)">
            <el-icon><Delete /></el-icon> 删除
          </el-button>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty
        v-if="!loading && demandStore.demandList.length === 0"
        description="您还没有发布求购需求"
      >
        <el-button type="primary" @click="openCreateDialog">发布第一个求购</el-button>
      </el-empty>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑求购需求"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="需求标题" required>
          <el-input
            v-model="editForm.title"
            placeholder="请输入求购商品名称"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="商品类目" required>
          <el-select
            v-model="editForm.category"
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

        <el-form-item label="求购数量" required>
          <el-input-number
            v-model="editForm.quantity"
            :min="1"
            :max="10000000"
            :step="100"
            style="width: 200px"
          />
          <el-select
            v-model="editForm.unit"
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
            v-model="editForm.budget"
            placeholder="例如：80-120元/件 或 面议"
          />
        </el-form-item>

        <el-form-item label="收货地址" required>
          <el-input
            v-model="editForm.deliveryAddress"
            placeholder="请输入收货地址"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="需求描述">
          <el-input
            v-model="editForm.description"
            type="textarea"
            :rows="4"
            placeholder="请详细描述您的需求"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="是否加急">
          <el-switch v-model="editForm.isUrgent" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpdate">保存修改</el-button>
      </template>
    </el-dialog>

    <!-- 创建弹窗 -->
    <CreateDemandDialog v-if="demandStore.isCreateDialogVisible" />
  </div>
</template>

<style scoped>
.my-demands-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
}

.demands-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demand-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}

.demand-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.demand-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.demand-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.demand-tags {
  display: flex;
  gap: 8px;
}

.demand-body {
  margin-bottom: 16px;
}

.description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.info-item {
  font-size: 14px;
}

.info-item .label {
  color: #999;
  margin-right: 4px;
}

.info-item .value {
  color: #303133;
  font-weight: 500;
}

.demand-actions {
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}
</style>
