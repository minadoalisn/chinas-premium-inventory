<template>
  <div class="users-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="page-title">
        <h2>用户管理</h2>
        <span class="subtitle">管理系统用户信息</span>
      </div>
      <div class="page-actions">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            class="input"
            placeholder="搜索用户..."
            @input="handleSearch"
          >
          <button @click="handleSearch" class="btn btn-primary">
            <i class="icon">🔍</i>
          </button>
        </div>
      </div>
    </div>

    <!-- 操作栏 -->
    <div class="actions-bar">
      <div class="filters">
        <select v-model="statusFilter" @change="loadUsers" class="select">
          <option value="">全部状态</option>
          <option value="active">正常</option>
          <option value="inactive">禁用</option>
        </select>
        <select v-model="roleFilter" @change="loadUsers" class="select">
          <option value="">全部角色</option>
          <option value="buyer">买家</option>
          <option value="merchant">商户</option>
          <option value="admin">管理员</option>
        </select>
      </div>
      <div class="bulk-actions">
        <span class="selected-count">已选择 {{ selectedUsers.length }} 项</span>
        <button
          @click="bulkDisable"
          :disabled="selectedUsers.length === 0"
          class="btn btn-outline btn-sm"
        >
          禁用
        </button>
        <button
          @click="bulkEnable"
          :disabled="selectedUsers.length === 0"
          class="btn btn-outline btn-sm"
        >
          启用
        </button>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="table-container card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th width="40">
                <input
                  type="checkbox"
                  v-model="selectAll"
                  @change="handleSelectAll"
                >
              </th>
              <th>ID</th>
              <th>手机号</th>
              <th>姓名</th>
              <th>角色</th>
              <th>商户</th>
              <th>状态</th>
              <th>注册时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="10" class="text-center">
                <div class="spinner"></div>
              </td>
            </tr>
            <tr v-else-if="users.length === 0">
              <td colspan="10" class="text-center">
                <div class="empty-state">
                  <div class="empty-icon">👥</div>
                  <p>暂无用户数据</p>
                </div>
              </td>
            </tr>
            <tr v-else v-for="user in users" :key="user.id">
              <td>
                <input
                  type="checkbox"
                  v-model="selectedUsers"
                  :value="user.id"
                >
              </td>
              <td>{{ user.id.slice(0, 8) }}...</td>
              <td>{{ user.phone }}</td>
              <td>{{ user.name || '-' }}</td>
              <td>
                <span class="badge" :class="getRoleBadge(user.role)">
                  {{ getRoleText(user.role) }}
                </span>
              </td>
              <td>{{ user.merchantName || '-' }}</td>
              <td>
                <span class="badge" :class="getStatusBadge(user.status)">
                  {{ getStatusText(user.status) }}
                </span>
              </td>
              <td>{{ formatDate(user.createdAt) }}</td>
              <td>
                <div class="action-buttons">
                  <button
                    @click="viewUser(user)"
                    class="btn btn-ghost btn-sm"
                    title="查看详情"
                  >
                    <i class="icon">👁️</i>
                  </button>
                  <button
                    @click="toggleUserStatus(user)"
                    :class="['btn', user.status === 'active' ? 'btn-outline' : 'btn-primary', 'btn-sm']"
                    :title="user.status === 'active' ? '禁用' : '启用'"
                  >
                    {{ user.status === 'active' ? '禁用' : '启用' }}
                  </button>
                  <button
                    @click="deleteUser(user)"
                    class="btn btn-ghost btn-sm"
                    title="删除"
                  >
                    <i class="icon">🗑️</i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="btn btn-ghost"
        >
          上一页
        </button>
        <span class="page-info">第 {{ currentPage }} 页，共 {{ totalPages }} 页（{{ total }} 条）</span>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage >= totalPages"
          class="btn btn-ghost"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/api'

// 状态
const users = ref<any[]>([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const roleFilter = ref('')
const selectedUsers = ref<string[]>([])
const selectAll = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 计算属性
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

// 方法
const loadUsers = async () => {
  loading.value = true
  try {
    const params: any = {
      page: currentPage.value,
      limit: pageSize.value,
    }
    
    if (searchQuery.value) params.search = searchQuery.value
    if (statusFilter.value) params.status = statusFilter.value
    if (roleFilter.value) params.role = roleFilter.value
    
    const response = await api.admin.getUsers(params)
    users.value = response.data
    total.value = response.total
  } catch (error) {
    console.error('加载用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadUsers()
}

const handleSelectAll = () => {
  if (selectAll.value) {
    selectedUsers.value = users.value.map(u => u.id)
  } else {
    selectedUsers.value = []
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadUsers()
  }
}

const viewUser = (user: any) => {
  console.log('查看用户:', user)
  // 打开用户详情弹窗
}

const toggleUserStatus = async (user: any) => {
  const action = user.status === 'active' ? '禁用' : '启用'
  if (!confirm(`确定要${action}用户 ${user.name || user.phone} 吗？`)) return
  
  try {
    await api.admin.updateUserStatus(user.id, {
      status: user.status === 'active' ? 'inactive' : 'active',
    })
    loadUsers()
  } catch (error) {
    console.error('更新用户状态失败:', error)
    alert('操作失败')
  }
}

const deleteUser = async (user: any) => {
  if (!confirm(`确定要删除用户 ${user.name || user.phone} 吗？此操作不可恢复！`)) return
  
  try {
    await api.admin.deleteUser(user.id)
    loadUsers()
  } catch (error) {
    console.error('删除用户失败:', error)
    alert('删除失败')
  }
}

const bulkDisable = async () => {
  if (!confirm(`确定要禁用选中的 ${selectedUsers.value.length} 个用户吗？`)) return
  
  try {
    await Promise.all(
      selectedUsers.value.map(id => api.admin.updateUserStatus(id, { status: 'inactive' }))
    )
    selectedUsers.value = []
    selectAll.value = false
    loadUsers()
  } catch (error) {
    console.error('批量禁用失败:', error)
    alert('批量操作失败')
  }
}

const bulkEnable = async () => {
  if (!confirm(`确定要启用选中的 ${selectedUsers.value.length} 个用户吗？`)) return
  
  try {
    await Promise.all(
      selectedUsers.value.map(id => api.admin.updateUserStatus(id, { status: 'active' }))
    )
    selectedUsers.value = []
    selectAll.value = false
    loadUsers()
  } catch (error) {
    console.error('批量启用失败:', error)
    alert('批量操作失败')
  }
}

// 工具方法
const getRoleBadge = (role: string) => {
  const badgeMap: Record<string, string> = {
    buyer: 'badge-tertiary',
    merchant: 'badge-primary',
    admin: 'badge-error',
  }
  return badgeMap[role] || 'badge-tertiary'
}

const getRoleText = (role: string) => {
  const textMap: Record<string, string> = {
    buyer: '买家',
    merchant: '商户',
    admin: '管理员',
  }
  return textMap[role] || '未知'
}

const getStatusBadge = (status: string) => {
  const badgeMap: Record<string, string> = {
    active: 'badge-success',
    inactive: 'badge-error',
  }
  return badgeMap[status] || 'badge-tertiary'
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    active: '正常',
    inactive: '禁用',
  }
  return textMap[status] || '未知'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

// 生命周期
onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.users-management {
  animation: fadeIn var(--transition-slow);
}

/* 页面头部 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
}

.page-title h2 {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.subtitle {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.page-actions {
  display: flex;
  gap: var(--space-4);
}

.search-box {
  display: flex;
  gap: var(--space-2);
}

.search-box .input {
  width: 300px;
}

/* 操作栏 */
.actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
  padding: var(--space-4);
  background: var(--bg-primary);
  border-radius: var(--radius-md);
}

.filters {
  display: flex;
  gap: var(--space-3);
}

.bulk-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.selected-count {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

/* 表格 */
.table-container {
  margin-bottom: var(--space-6);
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: var(--space-4);
  text-align: left;
  border-bottom: 1px solid var(--border-light);
}

.data-table th {
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-tertiary);
  font-size: var(--text-sm);
}

.data-table tbody tr:hover {
  background: var(--bg-tertiary);
}

.action-buttons {
  display: flex;
  gap: var(--space-2);
}

/* 空状态 */
.empty-state {
  padding: var(--space-16) var(--space-8);
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: var(--space-4);
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
}

/* 分页 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-4);
}

.page-info {
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

/* 响应式 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-4);
  }
  
  .search-box .input {
    width: 200px;
  }
  
  .actions-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-4);
  }
}
</style>
