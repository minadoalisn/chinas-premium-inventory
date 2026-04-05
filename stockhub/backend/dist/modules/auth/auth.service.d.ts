import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto, verifyCode: (phone: string, code: string) => Promise<boolean>): unknown;
    login(loginDto: LoginDto, verifyCode: (phone: string, code: string) => Promise<boolean>): unknown;
    getUser(userId: string): unknown;
}
