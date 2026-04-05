import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): unknown;
    findOne(id: string): unknown;
    create(createUserDto: CreateUserDto): unknown;
    update(id: string, updateData: Partial<CreateUserDto>): unknown;
    remove(id: string): unknown;
}
