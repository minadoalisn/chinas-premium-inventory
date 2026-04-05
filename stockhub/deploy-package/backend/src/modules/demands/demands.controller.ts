import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request } from '@nestjs/common';
import { DemandsService } from './demands.service';

@Controller('demands')
export class DemandsController {
  constructor(private readonly demandsService: DemandsService) {}

  @Post()
  create(@Request() req, @Body() createDemandDto: any) {
    const userId = req.user?.buyerId || req.user?.userId || req.user?.sub || '1';
    return this.demandsService.create(userId, createDemandDto);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('userId') userId?: string,
  ) {
    return this.demandsService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      userId: userId || req.user?.buyerId || req.user?.userId || null,
    });
  }

  @Get('my')
  getMyDemands(@Request() req) {
    const userId = req.user?.buyerId || req.user?.userId || '1';
    return this.demandsService.getMyDemands(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.demandsService.findOne(id);
  }

  @Get(':id/match')
  getMatch(@Param('id') id: string) {
    return this.demandsService.getMatch(id);
  }

  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateDemandDto: any) {
    const userId = req.user?.buyerId || req.user?.userId || '1';
    return this.demandsService.update(id, userId, updateDemandDto);
  }

  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    const userId = req.user?.buyerId || req.user?.userId || '1';
    await this.demandsService.remove(id, userId);
    return { success: true, message: '删除成功' };
  }
}
