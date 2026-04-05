import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MerchantsModule } from './modules/merchants/merchants.module';
import { DemandsModule } from './modules/demands/demands.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { SmsModule } from './modules/sms/sms.module';
import { InquiriesModule } from './modules/inquiries/inquiries.module';
import { OrdersModule } from './modules/orders/orders.module';
import { StatsModule } from './modules/stats/stats.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): any => ({
        type: configService.get('DB_TYPE', 'sqlite'),
        database: configService.get('DB_DATABASE', './data/stockhub.sqlite'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('DB_SYNCHRONIZE', 'true') === 'true',
        logging: configService.get('DB_LOGGING', 'true') === 'true',
        dropSchema: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    MerchantsModule,
    DemandsModule,
    ProductsModule,
    CategoriesModule,
    SmsModule,
    InquiriesModule,
    OrdersModule,
    StatsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
