import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'X-Client-Type': 'domestic',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  register: (data: {
    email: string
    password: string
    name: string
    phone: string
    role: string
  }) => api.post('/auth/register', data),

  getUser: () => api.get('/auth/me'),
}

export const categoryApi = {
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
}

export const productApi = {
  getAll: (params?: any) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  getSimilar: (id: string) => api.get(`/products/${id}/similar`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
}

export const demandApi = {
  getAll: (params?: any) => api.get('/demands', { params }),
  getById: (id: string) => api.get(`/demands/${id}`),
  getMyDemands: () => api.get('/demands/my'),
  getMatch: (id: string) => api.get(`/demands/${id}/match`),
  create: (data: any) => api.post('/demands', data),
  update: (id: string, data: any) => api.put(`/demands/${id}`, data),
  delete: (id: string) => api.delete(`/demands/${id}`),
}

export const merchantApi = {
  getProfile: () => api.get('/merchants/profile'),
  updateProfile: (data: any) => api.put('/merchants/profile', data),
}

export const inquiryApi = {
  create: (data: any) => api.post('/inquiries', data),
  getMyInquiries: () => api.get('/inquiries/my'),
}

export const orderApi = {
  create: (data: any) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my'),
  getById: (id: string) => api.get(`/orders/${id}`),
}

export default api
