import { Injectable } from '@nestjs/common';

@Injectable()
export class StatsService {
  constructor() {}

  async getDashboardStats() {
    return {
      totalUsers: 0,
      totalDemands: 0,
      totalProducts: 0,
      totalOrders: 0,
    };
  }
}
