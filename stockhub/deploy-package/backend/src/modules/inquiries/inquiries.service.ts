import { Injectable } from '@nestjs/common';

@Injectable()
export class InquiriesService {
  constructor() {}

  async findAll(params: any) {
    return { data: [], total: 0 };
  }

  async findOne(id: string) {
    return null;
  }

  async create(data: any) {
    return null;
  }
}
