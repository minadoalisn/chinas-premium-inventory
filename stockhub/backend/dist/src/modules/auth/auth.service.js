"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../users/entities/user.entity");
let AuthService = class AuthService {
    constructor(usersRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto, verifyCode) {
        if (registerDto.code !== '123456') {
            throw new common_1.UnauthorizedException('验证码错误（测试环境请使用：123456）');
        }
        const existingUser = await this.usersRepository.findOne({
            where: { phone: registerDto.phone },
        });
        if (existingUser) {
            throw new common_1.ConflictException('该手机号已注册');
        }
        const hashedPassword = await bcrypt.hash('123456', 10);
        const user = this.usersRepository.create({
            phone: registerDto.phone,
            password: hashedPassword,
            role: 'buyer',
            isActive: true,
        });
        await this.usersRepository.save(user);
        const token = this.jwtService.sign({
            userId: user.id,
            phone: user.phone,
            role: user.role,
        });
        return {
            success: true,
            message: '注册成功',
            token,
            user: {
                id: user.id,
                phone: user.phone,
                role: user.role,
            },
        };
    }
    async login(loginDto, verifyCode) {
        if (loginDto.code !== '123456') {
            throw new common_1.UnauthorizedException('验证码错误（测试环境请使用：123456）');
        }
        const user = await this.usersRepository.findOne({
            where: { phone: loginDto.phone },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('用户不存在');
        }
        const token = this.jwtService.sign({
            userId: user.id,
            phone: user.phone,
            role: user.role,
        });
        return {
            success: true,
            message: '登录成功',
            token,
            user: {
                id: user.id,
                phone: user.phone,
                role: user.role,
            },
        };
    }
    async getUser(userId) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('用户不存在');
        }
        return {
            id: user.id,
            phone: user.phone,
            role: user.role,
            nickname: user.nickname,
            avatar: user.avatar,
            createdAt: user.createdAt,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map