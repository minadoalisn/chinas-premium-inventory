import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: '健康检查' })
  getHello(): string {
    return 'StockHub API is running! 🚀';
  }
}
