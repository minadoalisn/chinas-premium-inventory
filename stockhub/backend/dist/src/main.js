"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const compression_1 = __importDefault(require("compression"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: process.env.CORS_ORIGIN || '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.use((0, compression_1.default)());
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
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
//# sourceMappingURL=main.js.map