import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const isProduction = process.env.NODE_ENV === 'production';

  const app = await NestFactory.create(AppModule, {
    logger: isProduction ? ['error', 'warn'] : ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS配置
  app.enableCors({
    origin: [
      'https://stockhub.cn',
      'https://www.stockhub.cn',
      'https://stockhub.com',
      'https://www.stockhub.com',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Client-Type', 'X-Request-ID'],
  });

  // 全局前缀
  app.setGlobalPrefix('api');

  // Swagger文档
  const config = new DocumentBuilder()
    .setTitle('StockHub API')
    .setDescription('跨境库存交易平台 API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', '认证相关')
    .addTag('users', '用户管理')
    .addTag('products', '商品管理')
    .addTag('categories', '类目管理')
    .addTag('demands', '求购需求')
    .addTag('inquiries', '询盘管理')
    .addTag('orders', '订单管理')
    .addTag('merchants', '商户管理')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 启动服务
  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 StockHub API is running on: http://localhost:${port}/api`);
  logger.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
  logger.log(`🌐 Domestic: https://stockhub.cn`);
  logger.log(`🌐 Overseas: https://stockhub.com`);
}

bootstrap();
