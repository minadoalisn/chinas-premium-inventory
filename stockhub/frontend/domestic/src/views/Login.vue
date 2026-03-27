<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { authApi } from '@/api'
import type { authApi } from '@/api'

const router = useRouter()

const loginForm = ref({
  email: '',
  password: '',
})

const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    const res = await authApi.login({
      email: loginForm.value.email,
      password: loginForm.value.password,
    })

    if (res.success) {
      localStorage.setItem('token', res.data.accessToken)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      ElMessage.success('登录成功')
      router.push('/')
    } else {
      ElMessage.error(res.message || '登录失败')
    }
  } catch (error: any) {
    console.error('Login error:', error)
    ElMessage.error(error.response?.data?.message || '登录失败，请检查账号密码')
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>库存易</h1>
        <p>欢迎回来</p>
      </div>

      <el-card class="login-form-card">
        <el-form
          :model="loginForm"
          label-width="80px"
          @submit.prevent="handleLogin"
        >
          <el-form-item label="邮箱">
            <el-input
              v-model="loginForm.email"
              placeholder="请输入邮箱"
              size="large"
            />
          </el-form-item>
          <el-form-item label="密码">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              show-password
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              style="width: 100%"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="login-footer">
          <span>还没有账号？</span>
          <el-link type="primary" @click="goToRegister">
            立即注册
          </el-link>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
  color: white;
}

.login-header h1 {
  font-size: 32px;
  margin: 0 0 8px;
}

.login-header p {
  font-size: 14px;
  opacity: 0.8;
  margin: 0;
}

.login-form-card {
  padding: 32px;
}

.login-footer {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  color: white;
}

.login-footer .el-link {
  color: white;
  margin-left: 4px;
  text-decoration: underline;
}
</style>
