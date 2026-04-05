import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto, verifyCode: (phone: string, code: string) => Promise<boolean>): Promise<{
        success: boolean;
        message: string;
        token: any;
        user: {
            id: any;
            phone: any;
            role: any;
        };
    }>;
    login(loginDto: LoginDto, verifyCode: (phone: string, code: string) => Promise<boolean>): Promise<{
        success: boolean;
        message: string;
        token: any;
        user: {
            id: any;
            phone: any;
            role: any;
        };
    }>;
    getUser(userId: string): Promise<{
        id: any;
        phone: any;
        role: any;
        nickname: any;
        avatar: any;
        createdAt: any;
    }>;
}
