"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const merchants_module_1 = require("./modules/merchants/merchants.module");
const demands_module_1 = require("./modules/demands/demands.module");
const products_module_1 = require("./modules/products/products.module");
const categories_module_1 = require("./modules/categories/categories.module");
const sms_module_1 = require("./modules/sms/sms.module");
const inquiries_module_1 = require("./modules/inquiries/inquiries.module");
const orders_module_1 = require("./modules/orders/orders.module");
const stats_module_1 = require("./modules/stats/stats.module");
const admin_module_1 = require("./modules/admin/admin.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: configService.get('DB_TYPE', 'sqlite'),
                    database: configService.get('DB_DATABASE', './data/stockhub.sqlite'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: configService.get('DB_SYNCHRONIZE', 'true') === 'true',
                    logging: configService.get('DB_LOGGING', 'true') === 'true',
                    dropSchema: false,
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            merchants_module_1.MerchantsModule,
            demands_module_1.DemandsModule,
            products_module_1.ProductsModule,
            categories_module_1.CategoriesModule,
            sms_module_1.SmsModule,
            inquiries_module_1.InquiriesModule,
            orders_module_1.OrdersModule,
            stats_module_1.StatsModule,
            admin_module_1.AdminModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
        exports: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map