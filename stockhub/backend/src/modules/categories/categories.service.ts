import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(clientType: 'domestic' | 'overseas' = 'domestic') {
    const categories = await this.categoryRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', id: 'ASC' },
    });

    // 格式化返回数据
    const formattedCategories = categories.map((cat) => ({
      id: cat.id,
      name: clientType === 'domestic' ? cat.name : cat.nameEn,
      nameEn: cat.nameEn,
      iconUrl: cat.iconUrl,
      bannerUrl: cat.bannerUrl,
      parentId: cat.parentId,
      sortOrder: cat.sortOrder,
    }));

    // 构建树形结构
    const categoryTree = this.buildTree(formattedCategories);

    return {
      success: true,
      data: categoryTree,
    };
  }

  async findOne(id: number, clientType: 'domestic' | 'overseas' = 'domestic') {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      return {
        success: false,
        message: 'Category not found',
      };
    }

    return {
      success: true,
      data: {
        id: category.id,
        name: clientType === 'domestic' ? category.name : category.nameEn,
        nameEn: category.nameEn,
        description: clientType === 'domestic' ? category.description : category.descriptionEn,
        iconUrl: category.iconUrl,
        bannerUrl: category.bannerUrl,
        seoTitle: category.seoTitle,
        seoKeywords: category.seoKeywords,
      },
    };
  }

  async findByParent(parentId: number = 0, clientType: 'domestic' | 'overseas' = 'domestic') {
    const categories = await this.categoryRepository.find({
      where: { parentId, isActive: true },
      order: { sortOrder: 'ASC' },
    });

    return {
      success: true,
      data: categories.map((cat) => ({
        id: cat.id,
        name: clientType === 'domestic' ? cat.name : cat.nameEn,
        iconUrl: cat.iconUrl,
      })),
    };
  }

  // 构建树形结构
  private buildTree(categories: any[], parentId: number = 0): any[] {
    return categories
      .filter((cat) => cat.parentId === parentId)
      .map((cat) => ({
        ...cat,
        children: this.buildTree(categories, cat.id),
      }));
  }

  // 初始化类目数据
  async seedCategories() {
    const categories = [
      { parentId: 0, name: '小家电', nameEn: 'Home Appliances', sortOrder: 1 },
      { parentId: 0, name: '电子产品', nameEn: 'Electronics', sortOrder: 2 },
      { parentId: 0, name: '快消品', nameEn: 'FMCG', sortOrder: 3 },
      { parentId: 0, name: '旅游用品', nameEn: 'Travel Supplies', sortOrder: 4 },
      { parentId: 0, name: '日用品', nameEn: 'Daily Necessities', sortOrder: 5 },
      { parentId: 0, name: '美妆', nameEn: 'Beauty & Cosmetics', sortOrder: 6 },
      { parentId: 0, name: '家居用品', nameEn: 'Home Furnishing', sortOrder: 7 },
      { parentId: 0, name: 'LED灯', nameEn: 'LED Lighting', sortOrder: 8 },
      { parentId: 0, name: '家具', nameEn: 'Furniture', sortOrder: 9 },
      { parentId: 0, name: '设备', nameEn: 'Equipment', sortOrder: 10 },
      { parentId: 0, name: '原材料', nameEn: 'Raw Materials', sortOrder: 11 },
      { parentId: 0, name: '五金建材', nameEn: 'Hardware & Building Materials', sortOrder: 12 },
    ];

    for (const cat of categories) {
      const exists = await this.categoryRepository.findOne({
        where: { name: cat.name },
      });
      if (!exists) {
        await this.categoryRepository.save(cat);
      }
    }

    return { success: true, message: 'Categories seeded' };
  }
}
