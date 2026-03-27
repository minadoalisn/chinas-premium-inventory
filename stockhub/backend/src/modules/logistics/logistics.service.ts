// ==========================================
// StockHub V2.0 - 物流接口
// ==========================================

import axios from 'axios'

// 物流公司配置
export const LOGISTICS_PROVIDERS = {
  SF: {
    name: '顺丰速运',
    code: 'SF',
    apiUrl: 'https://bsp.sf-express.com',
    apiKey: '',
    // 测试环境
    testUrl: 'https://bsptest.sf-express.com',
  },
  DHL: {
    name: 'DHL国际快递',
    code: 'DHL',
    apiUrl: 'https://api.dhl.com',
    apiKey: '',
  },
  FedEx: {
    name: 'FedEx联邦快递',
    code: 'FedEx',
    apiUrl: 'https://api.fedex.com',
    apiKey: '',
  },
  UPS: {
    name: 'UPS联合包裹',
    code: 'UPS',
    apiUrl: 'https://api.ups.com',
    apiKey: '',
  },
}

// 物流服务类
export class LogisticsService {
  private apiKey: string
  private apiUrl: string
  
  constructor(provider: keyof typeof LOGISTICS_PROVIDERS, isTest = true) {
    const config = LOGISTICS_PROVIDERS[provider]
    this.apiKey = config.apiKey
    this.apiUrl = isTest && config.testUrl ? config.testUrl : config.apiUrl
  }
  
  // 计算运费
  async calculateFreight(params: {
    from: string // 发货地
    to: string // 收货地
    weight: number // 重量(kg)
    length?: number // 长(cm)
    width?: number // 宽(cm)
    height?: number // 高(cm)
    value?: number // 货物价值(元)
  }) {
    try {
      const response = await axios.post(`${this.apiUrl}/freight/calculate`, {
        apiKey: this.apiKey,
        ...params,
      })
      return response.data
    } catch (error) {
      console.error('计算运费失败:', error)
      throw error
    }
  }
  
  // 查询物流轨迹
  async track(trackingNumber: string) {
    try {
      const response = await axios.get(`${this.apiUrl}/track/${trackingNumber}`, {
        params: { apiKey: this.apiKey },
      })
      return response.data
    } catch (error) {
      console.error('查询物流轨迹失败:', error)
      throw error
    }
  }
  
  // 预计到达时间
  async estimateArrival(params: {
    from: string
    to: string
    serviceType?: string // 服务类型
  }) {
    try {
      const response = await axios.post(`${this.apiUrl}/arrival/estimate`, {
        apiKey: this.apiKey,
        ...params,
      })
      return response.data
    } catch (error) {
      console.error('预计到达时间查询失败:', error)
      throw error
    }
  }
  
  // 获取服务类型
  async getServiceTypes() {
    try {
      const response = await axios.get(`${this.apiUrl}/services`, {
        params: { apiKey: this.apiKey },
      })
      return response.data
    } catch (error) {
      console.error('获取服务类型失败:', error)
      throw error
    }
  }
  
  // 生成电子面单
  async generateWaybill(params: {
    sender: {
      name: string
      phone: string
      address: string
      city: string
      province: string
      postcode: string
    }
    receiver: {
      name: string
      phone: string
      address: string
      city: string
      province: string
      postcode: string
    }
    package: {
      weight: number
      items: Array<{
        name: string
        quantity: number
        value?: number
      }>
    }
    serviceType?: string
  }) {
    try {
      const response = await axios.post(`${this.apiUrl}/waybill/generate`, {
        apiKey: this.apiKey,
        ...params,
      })
      return response.data
    } catch (error) {
      console.error('生成电子面单失败:', error)
      throw error
    }
  }
}

// 物流对比服务
export class LogisticsComparisonService {
  // 对比多家物流运费
  async compareFreight(params: {
    from: string
    to: string
    weight: number
    dimensions?: {
      length: number
      width: number
      height: number
    }
    providers?: string[] // 指定物流公司
  }) {
    const results = []
    const providers = params.providers || ['SF', 'DHL', 'FedEx', 'UPS']
    
    for (const providerCode of providers) {
      try {
        const service = new LogisticsService(providerCode as keyof typeof LOGISTICS_PROVIDERS)
        const freight = await service.calculateFreight(params)
        results.push({
          provider: LOGISTICS_PROVIDERS[providerCode as keyof typeof LOGISTICS_PROVIDERS].name,
          code: providerCode,
          price: freight.price,
          estimatedDays: freight.estimatedDays,
          serviceType: freight.serviceType,
        })
      } catch (error) {
        console.error(`获取${providerCode}运费失败:`, error)
      }
    }
    
    // 按价格排序
    return results.sort((a, b) => a.price - b.price)
  }
  
  // 推荐最优物流方案
  async recommendBest(params: {
    from: string
    to: string
    weight: number
    budget?: number // 预算
    urgent?: boolean // 是否加急
  }) {
    const comparison = await this.compareFreight(params)
    
    // 根据需求推荐
    if (params.urgent) {
      // 加急：选择最快的
      return comparison.sort((a, b) => a.estimatedDays - b.estimatedDays)[0]
    } else if (params.budget) {
      // 有预算：选择性价比最高的
      const withinBudget = comparison.filter(r => r.price <= params.budget!)
      if (withinBudget.length > 0) {
        return withinBudget[0]
      }
    }
    
    // 默认：选择性价比最高的（价格/天）
    return comparison.sort((a, b) => {
      const scoreA = a.price / a.estimatedDays
      const scoreB = b.price / b.estimatedDays
      return scoreA - scoreB
    })[0]
  }
}

// 物流追踪服务
export class LogisticsTrackingService {
  // 批量追踪
  async batchTrack(trackingNumbers: Array<{
    number: string
    provider: string
  }>) {
    const results = []
    
    for (const item of trackingNumbers) {
      try {
        const service = new LogisticsService(item.provider as keyof typeof LOGISTICS_PROVIDERS)
        const tracking = await service.track(item.number)
        results.push({
          number: item.number,
          provider: item.provider,
          status: tracking.status,
          lastUpdate: tracking.lastUpdate,
          estimatedDelivery: tracking.estimatedDelivery,
          trackingDetails: tracking.trackingDetails,
        })
      } catch (error) {
        console.error(`追踪${item.number}失败:`, error)
        results.push({
          number: item.number,
          provider: item.provider,
          error: '追踪失败',
        })
      }
    }
    
    return results
  }
  
  // 订阅物流状态变化
  async subscribeTracking(trackingNumber: string, provider: string, callback: (data: any) => void) {
    // 实际实现需要后端WebSocket支持
    console.log(`订阅物流状态: ${trackingNumber} (${provider})`)
    // 这里可以连接到WebSocket监听状态变化
  }
}

// 导出单例
export const logisticsService = new LogisticsComparisonService()
export const trackingService = new LogisticsTrackingService()

// 使用示例
/*
// 计算运费
const freight = await logisticsService.compareFreight({
  from: '北京市',
  to: '上海市',
  weight: 10,
  dimensions: { length: 30, width: 20, height: 15 }
})

// 推荐最优方案
const best = await logisticsService.recommendBest({
  from: '北京市',
  to: '新加坡',
  weight: 5,
  urgent: false
})

// 追踪物流
const tracking = await trackingService.batchTrack([
  { number: 'SF123456789', provider: 'SF' },
  { number: 'DHL987654321', provider: 'DHL' }
])
*/
