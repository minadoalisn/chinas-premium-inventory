import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局验证管道
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // 启用CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 启用压缩
  app.use(compression());

  // 全局前缀
  app.setGlobalPrefix('api');

  // Swagger配置
  const config = new DocumentBuilder()
    .setTitle('StockHub API')
    .setDescription('跨境库存交易平台API文档')
    .setVersion('2.0')
    .addBearerAuth()
    .addTag('Auth', '认证相关')
    .addTag('Users', '用户管理')
    .addTag('Merchants', '商户管理')
    .addTag('Demands', '求购需求')
    .addTag('Products', '商品管理')
    .addTag('Categories', '类目管理')
    .addTag('Inquiries', '询盘管理')
    .addTag('Orders', '订单管理')
    .addTag('SMS', '短信服务')
    .addTag('Upload', '文件上传')
    .addTag('Notifications', '消息通知')
    .addTag('Stats', '数据统计')
    .addTag('Logistics', '物流管理')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'StockHub API Documentation',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
  ╔════════════════════════════════════════════════════════╗
  ║                                                      ║
  ║   🚀 StockHub API Server - v2.0                      ║
  ║                                                      ║
  ║   📍 Local:   http://localhost:${port}                   ║
  ║   📚 Docs:    http://localhost:${port}/api/docs         ║
  ║                                                      ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}              ║
  ║   Database:    ${process.env.DB_TYPE || 'sqlite'}                      ║
  ║                                                      ║
  ╚════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
