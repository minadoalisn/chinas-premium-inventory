import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: '获取所有用户' })
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      success: true,
      data: users.map((u) => ({
        id: u.id,
        email: u.phone,
        name: u.name,
        phone: u.phone,
        role: u.role,
        createdAt: u.createdAt,
      })),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户详情' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    return {
      success: true,
      data: {
        id: user.id,
        email: user.phone,
        name: user.name,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }

  @Post()
  @ApiOperation({ summary: '创建用户' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      success: true,
      data: {
        id: user.id,
        email: user.phone,
        name: user.name,
      },
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新用户' })
  async update(@Param('id') id: string, @Body() updateData: Partial<CreateUserDto>) {
    const user = await this.usersService.update(id, updateData);
    return {
      success: true,
      data: {
        id: user.id,
        email: user.phone,
        name: user.name,
      },
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除用户' })
  async remove(@Param('id') id: string) {
    await this.usersService.delete(id);
    return { success: true };
  }
}
