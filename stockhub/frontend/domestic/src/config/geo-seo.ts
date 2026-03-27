// ==========================================
// StockHub V2.0 - GEO和SEO配置
// ==========================================

export const GEO_CONFIG = {
  // 支持的地区
  regions: {
    CN: {
      name: '中国',
      currency: 'CNY',
      symbol: '¥',
      language: 'zh-CN',
      timezone: 'Asia/Shanghai',
      phoneCode: '+86',
    },
    US: {
      name: 'United States',
      currency: 'USD',
      symbol: '$',
      language: 'en-US',
      timezone: 'America/New_York',
      phoneCode: '+1',
    },
    EU: {
      name: 'Europe',
      currency: 'EUR',
      symbol: '€',
      language: 'en-GB',
      timezone: 'Europe/London',
      phoneCode: '+44',
    },
    SG: {
      name: 'Singapore',
      currency: 'SGD',
      symbol: 'S$',
      language: 'en-SG',
      timezone: 'Asia/Singapore',
      phoneCode: '+65',
    },
  },
  
  // 货币汇率（实时更新）
  exchangeRates: {
    CNY: 1, // 基准货币
    USD: 0.14,
    EUR: 0.13,
    SGD: 0.19,
  },
  
  // 获取用户地区
  detectRegion: () => {
    const region = localStorage.getItem('user_region') || 'CN'
    return region
  },
  
  // 设置用户地区
  setRegion: (region: string) => {
    localStorage.setItem('user_region', region)
    window.location.reload()
  },
  
  // 获取地区配置
  getRegionConfig: (region?: string) => {
    const key = region || GEO_CONFIG.detectRegion()
    return GEO_CONFIG.regions[key as keyof typeof GEO_CONFIG.regions]
  },
  
  // 价格转换
  convertPrice: (price: number, fromCurrency: string, toCurrency: string) => {
    const fromRate = GEO_CONFIG.exchangeRates[fromCurrency as keyof typeof GEO_CONFIG.exchangeRates] || 1
    const toRate = GEO_CONFIG.exchangeRates[toCurrency as keyof typeof GEO_CONFIG.exchangeRates] || 1
    return (price * toRate) / fromRate
  },
  
  // 格式化价格
  formatPrice: (price: number, currency?: string) => {
    const config = GEO_CONFIG.getRegionConfig(currency)
    return new Intl.NumberFormat(config.language, {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price)
  },
}

// SEO配置
export const SEO_CONFIG = {
  // 网站信息
  site: {
    name: 'StockHub',
    title: 'StockHub - 跨境库存交易平台',
    description: '专业的跨境库存求购和特卖平台，连接全球买家和卖家',
    keywords: ['跨境库存', '求购', '特卖', '库存交易', 'B2B'],
    url: 'https://stockhub.com',
    logo: '/logo.png',
    ogImage: '/og-image.png',
  },
  
  // 页面默认SEO
  defaults: {
    title: 'StockHub - 跨境库存交易平台',
    description: '专业的跨境库存求购和特卖平台，连接全球买家和卖家',
    image: '/og-image.png',
    type: 'website',
  },
  
  // 页面SEO配置
  pages: {
    home: {
      title: 'StockHub - 跨境库存求购和特卖平台',
      description: '发布求购需求，寻找优质库存，StockHub为您提供专业的跨境库存交易服务',
      keywords: ['跨境库存', '求购', '特卖', '库存交易'],
    },
    products: {
      title: '库存商品 - StockHub',
      description: '浏览海量优质库存商品，找到您需要的货源',
      keywords: ['库存商品', '货源', '批发', 'B2B'],
    },
    demands: {
      title: '求购大厅 - StockHub',
      description: '发布求购需求，让优质库存主动找上门',
      keywords: ['求购', '需求发布', 'B2B采购'],
    },
    merchant: {
      title: '商户中心 - StockHub',
      description: '管理您的商品、订单和客户信息',
      keywords: ['商户中心', '店铺管理'],
    },
  },
  
  // 生成页面Meta标签
  generateMeta: (page: string, customMeta?: any) => {
    const pageConfig = SEO_CONFIG.pages[page as keyof typeof SEO_CONFIG.pages] || {}
    const config = { ...SEO_CONFIG.defaults, ...pageConfig, ...customMeta }
    
    return {
      title: config.title,
      description: config.description,
      keywords: config.keywords,
      openGraph: {
        title: config.title,
        description: config.description,
        type: config.type,
        url: `${SEO_CONFIG.site.url}${window.location.pathname}`,
        images: [
          {
            url: config.image,
            width: 1200,
            height: 630,
            alt: config.title,
          },
        ],
        siteName: SEO_CONFIG.site.name,
      },
      twitter: {
        card: 'summary_large_image',
        title: config.title,
        description: config.description,
        images: [config.image],
      },
      alternates: {
        canonical: `${SEO_CONFIG.site.url}${window.location.pathname}`,
        languages: {
          'zh-CN': `${SEO_CONFIG.site.url}/zh-CN${window.location.pathname}`,
          'en': `${SEO_CONFIG.site.url}/en${window.location.pathname}`,
        },
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    }
  },
  
  // 生成结构化数据
  generateStructuredData: (type: string, data: any) => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type,
    }
    
    switch (type) {
      case 'WebSite':
        return {
          ...baseData,
          url: SEO_CONFIG.site.url,
          name: SEO_CONFIG.site.name,
          description: SEO_CONFIG.site.description,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SEO_CONFIG.site.url}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }
      
      case 'Organization':
        return {
          ...baseData,
          name: SEO_CONFIG.site.name,
          url: SEO_CONFIG.site.url,
          logo: SEO_CONFIG.site.logo,
          description: SEO_CONFIG.site.description,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+86-400-xxx-xxxx',
            contactType: 'customer service',
          },
        }
      
      case 'Product':
        return {
          ...baseData,
          name: data.title,
          description: data.description,
          image: data.images,
          offers: {
            '@type': 'Offer',
            price: data.price,
            priceCurrency: 'CNY',
            availability: 'https://schema.org/InStock',
          },
        }
      
      default:
        return baseData
    }
  },
}

// Sitemap生成
export const generateSitemap = (baseUrl: string) => {
  const routes = [
    { path: '', priority: 1.0, changeFreq: 'daily' },
    { path: '/products', priority: 0.9, changeFreq: 'hourly' },
    { path: '/demands', priority: 0.9, changeFreq: 'hourly' },
    { path: '/merchant-center', priority: 0.8, changeFreq: 'daily' },
  ]
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `
  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route.changeFreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('')}
</urlset>`
}

// Robots.txt生成
export const generateRobotsTxt = (sitemapUrl: string) => {
  return `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}

# 禁止爬取的路径
Disallow: /api/
Disallow: /admin/
Disallow: /login
Disallow: /register
Disallow: /forgot-password
`
}
