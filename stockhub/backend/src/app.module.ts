import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientTypeMiddleware } from './common/middleware/client-type.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { DemandsModule } from './modules/demands/demands.module';
import { InquiriesModule } from './modules/inquiries/inquiries.module';
import { OrdersModule } from './modules/orders/orders.module';
import { MerchantsModule } from './modules/merchants/merchants.module';

@Module({
  imports: [
    // 环境变量配置
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 数据库配置
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_DATABASE', 'stockhub'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('DB_SYNCHRONIZE', false), // 生产环境关闭
        logging: configService.get('NODE_ENV', 'development') === 'development',
        timezone: '+08:00',
        charset: 'utf8mb4_unicode_ci',
      }),
    }),

    // 业务模块
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    DemandsModule,
    InquiriesModule,
    OrdersModule,
    MerchantsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 应用客户端类型中间件到所有路由
    consumer.apply(ClientTypeMiddleware).forRoutes('*');
  }
}
