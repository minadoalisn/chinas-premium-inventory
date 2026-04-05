import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        success: boolean;
        data: {
            id: string;
            email: string;
            name: any;
            phone: string;
            role: "buyer" | "merchant" | "admin";
            createdAt: Date;
        }[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            id: string;
            email: string;
            name: any;
            phone: string;
            role: "buyer" | "merchant" | "admin";
            createdAt: Date;
        };
        message?: undefined;
    }>;
    create(createUserDto: CreateUserDto): Promise<{
        success: boolean;
        data: {
            id: string;
            email: string;
            name: any;
        };
    }>;
    update(id: string, updateData: Partial<CreateUserDto>): Promise<{
        success: boolean;
        data: {
            id: string;
            email: string;
            name: any;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
