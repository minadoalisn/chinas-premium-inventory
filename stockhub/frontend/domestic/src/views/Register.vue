<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { authApi } from '@/api'

const router = useRouter()

const registerForm = ref({
  email: '',
  password: '',
  name: '',
  phone: '',
  confirmPassword: '',
})

const registerFormRef = ref()

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value !== registerForm.value.password) {
          callback(new Error('两次密码不一致'))
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
  phone: [
    { type: 'string', pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
}

const loading = ref(false)

const handleRegister = async () => {
  if (!registerFormRef.value) return

  try {
    await registerFormRef.value.validate()

    loading.value = true
    const res = await authApi.register({
      email: registerForm.value.email,
      password: registerForm.value.password,
      name: registerForm.value.name,
      phone: registerForm.value.phone,
      role: 'buyer',
    })

    if (res.success) {
      ElMessage.success('注册成功，请登录')
      router.push('/login')
    } else {
      ElMessage.error(res.message || '注册失败')
    }
  } catch (error: any) {
    console.error('Register error:', error)
    ElMessage.error(error.response?.data?.message || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <h1>注册账号</h1>
        <p>加入库存易，快速找到优质库存</p>
      </div>

      <el-card class="register-form-card">
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="rules"
          label-width="100px"
          @submit.prevent="handleRegister"
        >
          <el-form-item label="姓名" prop="name">
            <el-input v-model="registerForm.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="registerForm.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="registerForm.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码（至少6位）"
              show-password
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              show-password
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              style="width: 100%"
              @click="handleRegister"
            >
              注册
            </el-button>
          </el-form-item>

          <div class="register-footer">
            <span>已有账号？</span>
            <el-link type="primary" @click="router.push('/login')">
              立即登录
            </el-link>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 400px;
}

.register-header {
  text-align: center;
  margin-bottom: 24px;
  color: white;
}

.register-header h1 {
  font-size: 32px;
  margin: 0 0 8px;
}

.register-header p {
  font-size: 14px;
  opacity: 0.8;
  margin: 0;
}

.register-form-card {
  padding: 32px;
}

.register-footer {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  color: white;
}

.register-footer .el-link {
  color: white;
  margin-left: 4px;
  text-decoration: underline;
}
</style>
