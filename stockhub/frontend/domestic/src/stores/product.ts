import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductStore = defineStore('product', () => {
  const products = ref<any[]>([])
  const productList = ref<any[]>([])
  const selectedProducts = ref<Set<string>>(new Set())
  const isLoading = ref(false)

  const selectProduct = (productId: string) => {
    selectedProducts.value.add(productId)
  }

  const removeProduct = (productId: string) => {
    selectedProducts.value.delete(productId)
  }

  const clearSelection = () => {
    selectedProducts.value.clear()
  }

  // 获取选中的商品详情
  const selectedProductDetails = computed(() => {
    return productList.value.filter((p: any) =>
      selectedProducts.value.has(p.id)
    )
  })

  const selectedCount = computed(() => selectedProducts.value.size)

  const selectedTotal = computed(() => {
    return selectedProductDetails.value.reduce((sum, p: any) => sum + (p.stockQty * p.domesticPrice), 0)
  })

  return {
    products,
    productList,
    isLoading,
    selectedProducts,
    selectedCount,
    selectedTotal,
    selectProduct,
    removeProduct,
    clearSelection,
    setProducts: (list: any[]) => {
      products.value = list
      productList.value = list
    },
    setLoading: (loading: boolean) => {
      isLoading.value = loading
    },
  }
})
