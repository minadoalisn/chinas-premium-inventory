import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  constructor() {}

  async getDashboard() {
    return {
      totalUsers: 0,
      totalDemands: 0,
      totalProducts: 0,
      totalOrders: 0,
    };
  }
}
