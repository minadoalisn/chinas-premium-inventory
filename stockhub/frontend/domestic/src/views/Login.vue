<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const loginForm = ref({
  phone: '',
  code: '',
})

const loginFormRef = ref()

const rules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '验证码必须是6位数字', trigger: 'blur' },
  ],
}

const loading = ref(false)
const sendingCode = ref(false)
const countdown = ref(0)
const countdownTimer = ref<NodeJS.Timeout | null>(null)

// 发送验证码
const sendCode = async () => {
  if (!loginForm.value.phone) {
    ElMessage.warning('请先输入手机号')
    return
  }

  if (!/^1[3-9]\d{9}$/.test(loginForm.value.phone)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }

  sendingCode.value = true
  try {
    const res = await fetch('/api/sms/send-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Type': 'domestic',
      },
      body: JSON.stringify({
        phone: loginForm.value.phone,
      }),
    }).then(res => res.json())

    if (res.success) {
      ElMessage.success('验证码已发送')
      startCountdown()
    } else {
      ElMessage.error(res.message || '验证码发送失败')
    }
  } catch (error) {
    console.error('Failed to send code:', error)
    ElMessage.error('验证码发送失败，请稍后重试')
  } finally {
    sendingCode.value = false
  }
}

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60
  countdownTimer.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer.value!)
      countdownTimer.value = null
    }
  }, 1000)
}

// 登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()

    loading.value = true
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Type': 'domestic',
      },
      body: JSON.stringify(loginForm.value),
    }).then(res => res.json())

    if (res.success || res.accessToken) {
      localStorage.setItem('token', res.accessToken)
      localStorage.setItem('user', JSON.stringify(res.user))
      ElMessage.success('登录成功')
      router.push('/')
    } else {
      ElMessage.error(res.message || '登录失败')
    }
  } catch (error: any) {
    console.error('Login error:', error)
    ElMessage.error(error.response?.data?.message || '登录失败，请检查验证码')
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
          ref="loginFormRef"
          :model="loginForm"
          :rules="rules"
          label-width="80px"
          @submit.prevent="handleLogin"
        >
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="loginForm.phone" placeholder="请输入手机号" maxlength="11" />
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <div class="code-input-group">
              <el-input
                v-model="loginForm.code"
                placeholder="请输入验证码"
                maxlength="6"
                class="code-input"
              />
              <el-button
                :disabled="countdown > 0 || sendingCode"
                :loading="sendingCode"
                @click="sendCode"
                class="code-button"
              >
                {{ countdown > 0 ? `${countdown}秒` : '获取验证码' }}
              </el-button>
            </div>
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

.code-input-group {
  display: flex;
  gap: 12px;
}

.code-input {
  flex: 1;
}

.code-button {
  min-width: 120px;
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
