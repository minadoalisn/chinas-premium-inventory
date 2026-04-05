import { Controller, Get } from '@nestjs/common';

@Controller('stats')
export class StatsController {
  @Get()
  getStats() {
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      activeUsers: 0,
    };
  }
}
