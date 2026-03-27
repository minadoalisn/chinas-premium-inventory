import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<any>(null)

  const isAuthenticated = computed(() => !!token.value)

  const login = (token: string, user: any) => {
    token.value = token
    user.value = user
    localStorage.setItem('token', token)
  })

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  const setUser = (userData: any) => {
    user.value = userData
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    setUser,
  }
})
