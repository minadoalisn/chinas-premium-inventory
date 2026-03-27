import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ==================== 统计数据 ====================

  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('stats/order-trend')
  async getOrderTrend(@Query('period') period: string) {
    return this.adminService.getOrderTrend(parseInt(period) || 7);
  }

  @Get('stats/recent-activities')
  async getRecentActivities(@Query('limit') limit?: string) {
    return this.adminService.getRecentActivities(parseInt(limit) || 10);
  }

  // ==================== 用户管理 ====================

  @Get('users')
  async getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('role') role?: string,
  ) {
    return this.adminService.getUsers({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      search,
      status,
      role,
    });
  }

  @Get('users/:id')
  async getUserDetail(@Param('id') id: string) {
    return this.adminService.getUserDetail(id);
  }

  @Put('users/:id/status')
  async updateUserStatus(
    @Param('id') id: string,
    @Body() body: { status: 'active' | 'inactive' },
  ) {
    return this.adminService.updateUserStatus(id, body.status);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // ==================== 商户管理 ====================

  @Get('merchants')
  async getMerchants(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getMerchants({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      search,
      status,
    });
  }

  @Get('merchants/:id')
  async getMerchantDetail(@Param('id') id: string) {
    return this.adminService.getMerchantDetail(id);
  }

  @Post('merchants/:id/approve')
  async approveMerchant(@Param('id') id: string) {
    return this.adminService.approveMerchant(id);
  }

  @Post('merchants/:id/reject')
  async rejectMerchant(@Param('id') id: string) {
    return this.adminService.rejectMerchant(id);
  }

  // ==================== 商品管理 ====================

  @Get('products')
  async getProducts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.adminService.getProducts({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      search,
      status,
      categoryId,
    });
  }

  @Get('products/:id')
  async getProductDetail(@Param('id') id: string) {
    return this.adminService.getProductDetail(id);
  }

  @Post('products/:id/approve')
  async approveProduct(@Param('id') id: string) {
    return this.adminService.approveProduct(id);
  }

  @Post('products/:id/reject')
  async rejectProduct(@Param('id') id: string) {
    return this.adminService.rejectProduct(id);
  }

  @Post('products/:id/list')
  async listProduct(@Param('id') id: string) {
    return this.adminService.listProduct(id);
  }

  @Post('products/:id/unlist')
  async unlistProduct(@Param('id') id: string) {
    return this.adminService.unlistProduct(id);
  }

  // ==================== 订单管理 ====================

  @Get('orders')
  async getOrders(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('buyerId') buyerId?: string,
    @Query('sellerId') sellerId?: string,
  ) {
    return this.adminService.getOrders({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      status,
      buyerId,
      sellerId,
    });
  }

  @Get('orders/:id')
  async getOrderDetail(@Param('id') id: string) {
    return this.adminService.getOrderDetail(id);
  }

  @Post('orders/:id/ship')
  async shipOrder(
    @Param('id') id: string,
    @Body() body: { trackingNumber: string; logisticsCompany: string },
  ) {
    return this.adminService.shipOrder(id, body.trackingNumber, body.logisticsCompany);
  }

  @Post('orders/:id/cancel')
  async cancelOrder(@Param('id') id: string) {
    return this.adminService.cancelOrder(id);
  }

  // ==================== 求购管理 ====================

  @Get('demands')
  async getDemands(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getDemands({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      search,
      status,
    });
  }

  @Get('demands/:id')
  async getDemandDetail(@Param('id') id: string) {
    return this.adminService.getDemandDetail(id);
  }

  @Delete('demands/:id')
  async deleteDemand(@Param('id') id: string) {
    return this.adminService.deleteDemand(id);
  }

  // ==================== 类目管理 ====================

  @Get('categories')
  async getCategories() {
    return this.adminService.getCategories();
  }

  @Post('categories')
  async createCategory(@Body() createCategoryDto: any) {
    return this.adminService.createCategory(createCategoryDto);
  }

  @Put('categories/:id')
  async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: any) {
    return this.adminService.updateCategory(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.adminService.deleteCategory(id);
  }

  // ==================== 系统设置 ====================

  @Get('settings')
  async getSettings() {
    return this.adminService.getSettings();
  }

  @Put('settings')
  async updateSettings(@Body() settingsDto: any) {
    return this.adminService.updateSettings(settingsDto);
  }

  @Get('settings/:section')
  async getSettingsSection(@Param('section') section: string) {
    return this.adminService.getSettingsSection(section);
  }

  @Put('settings/:section')
  async updateSettingsSection(
    @Param('section') section: string,
    @Body() settingsDto: any,
  ) {
    return this.adminService.updateSettingsSection(section, settingsDto);
  }
}
