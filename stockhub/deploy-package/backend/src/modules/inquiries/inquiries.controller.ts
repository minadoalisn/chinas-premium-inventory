import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';

@Controller('api/inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Get()
  async findAll() {
    return this.inquiriesService.findAll({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.inquiriesService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.inquiriesService.create(data);
  }
}
