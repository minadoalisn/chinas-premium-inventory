import { defineStore } from 'pinia'
import { ref, ref } from 'vue'

export const useDemandStore = defineStore('demand', () => {
  const demandList = ref<any[]>([])
  const selectedDemand = ref<any>(null)
  const isCreateDialogVisible = ref(false)

  const createDemand = (demand: any) => {
    demandList.value.unshift(demand)
    isCreateDialogVisible.value = false
  }

  const selectDemand = (demand: any) => {
    selectedDemand.value = demand
  }

  const updateDemand = (demandId: string, updates: any) => {
    const index = demandList.value.findIndex((d: any) => d.id === demandId)
    if (index !== -1) {
      Object.assign(demandList.value[index], updates)
    }
  }

  const deleteDemand = (demandId: string) => {
    const index = demandList.value.findIndex((d: any) => d.id === demandId)
    if (index !== -1) {
      demandList.value.splice(index, 1)
    }
  }

  return {
    demandList,
    selectedDemand,
    isCreateDialogVisible,
    isUpdateDialogVisible: ref(false),
    createDemand,
    selectDemand,
    updateDemand,
    deleteDemand,
  }
})
