import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { SmsModule } from '../sms/sms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'stockhub-jwt-secret-key-2026'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRE', '7d'),
        },
      }),
      inject: [ConfigService],
    }),
    // PassportModule.register({ defaultStrategy: 'jwt' }),  // 暂时禁用
    SmsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],  // 暂时禁用 JwtStrategy
  exports: [AuthService],
})
export class AuthModule {}
