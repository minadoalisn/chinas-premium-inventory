<script setup lang="ts">
import { ref } from "vue"
const emit = defineEmits(["close", "success"])
const phone = ref("")
const code = ref("")
const sendCodeLoading = ref(false)
const loginLoading = ref(false)
const handleSendCode = async () => {
  if (!phone.value) {
    alert("请输入手机号")
    return
  }
  sendCodeLoading.value = true
  try {
    const res = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phone.value })
    })
    const data = await res.json()
    if (data.success) {
      alert("验证码已发送")
    } else {
      alert(data.message || "发送失败")
    }
  } catch (e) {
    alert("发送失败")
  } finally {
    sendCodeLoading.value = false
  }
}
const handleLogin = () => {
  if (!phone.value || !code.value) {
    alert("请输入手机号和验证码")
    return
  }
  loginLoading.value = true
  fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: phone.value, code: code.value })
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        emit("success")
        emit("close")
      } else {
        alert(data.message || "登录失败")
      }
    })
    .catch(() => alert("登录失败"))
    .finally(() => loginLoading.value = false)
}
</script>

<template>
  <div class="login-dialog-overlay" @click.self="emit('close')">
    <div class="login-dialog">
      <h2>登录</h2>
      <div class="form-group">
        <input v-model="phone" type="tel" placeholder="手机号" maxlength="11" />
      </div>
      <div class="form-group code-group">
        <input v-model="code" type="text" placeholder="验证码" maxlength="6" />
        <button @click="handleSendCode" :disabled="sendCodeLoading">
          {{ sendCodeLoading ? '发送中...' : '获取验证码' }}
        </button>
      </div>
      <button class="login-btn" @click="handleLogin" :disabled="loginLoading">
        {{ loginLoading ? '登录中...' : '登录' }}
      </button>
      <button class="close-btn" @click="emit('close')">取消</button>
    </div>
  </div>
</template>

<style scoped>
.login-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.login-dialog {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
}
.login-dialog h2 {
  text-align: center;
  margin: 0 0 20px;
  color: #333;
}
.form-group {
  margin-bottom: 15px;
}
.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}
.code-group {
  display: flex;
  gap: 10px;
}
.code-group input {
  flex: 1;
}
.code-group button {
  padding: 12px 15px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
}
.code-group button:disabled {
  background: #ccc;
}
.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
}
.login-btn:disabled {
  background: #ccc;
}
.close-btn {
  width: 100%;
  padding: 12px;
  background: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>
