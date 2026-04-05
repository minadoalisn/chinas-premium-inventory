import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  /**
   * 初始化12个类目数据
   */
  async initializeCategories(): Promise<void> {
    const count = await this.categoriesRepository.count();
    if (count > 0) {
      console.log('类目数据已存在，跳过初始化');
      return;
    }

    const categories = [
      { id: '1', name: '小家电', color: 'red', icon: 'ri-home-smile-line' },
      { id: '2', name: '电子产品', color: 'blue', icon: 'ri-smartphone-line' },
      { id: '3', name: '快消品', color: 'green', icon: 'ri-shopping-basket-line' },
      { id: '4', name: '旅游用品', color: 'yellow', icon: 'ri-suitcase-line' },
      { id: '5', name: '日用品', color: 'orange', icon: 'ri-home-gear-line' },
      { id: '6', name: '美妆', color: 'purple', icon: 'ri-magic-line' },
      { id: '7', name: '家居用品', color: 'pink', icon: 'ri-home-4-line' },
      { id: '8', name: 'LED灯', color: 'teal', icon: 'ri-lightbulb-line' },
      { id: '9', name: '家具', color: 'indigo', icon: 'ri-armchair-line' },
      { id: '10', name: '设备', color: 'violet', icon: 'ri-tools-line' },
      { id: '11', name: '原材料', color: 'cyan', icon: 'ri-leaf-line' },
      { id: '12', name: '五金建材', color: 'gray', icon: 'ri-hammer-line' },
    ];

    for (const categoryData of categories) {
      const category = this.categoriesRepository.create(categoryData);
      await this.categoriesRepository.save(category);
    }

    console.log(`已初始化 ${categories.length} 个类目`);
  }

  /**
   * 获取所有类目
   */
  async findAll() {
    return this.categoriesRepository.find({
      order: { id: 'ASC' },
    });
  }

  /**
   * 获取单个类目
   */
  async findOne(id: string) {
    return this.categoriesRepository.findOne({
      where: { id },
    });
  }

  /**
   * 根据ID列表获取类目
   */
  async findByIds(ids: string[]) {
    return this.categoriesRepository.find({
      where: ids.map(id => ({ id })),
    });
  }
}
