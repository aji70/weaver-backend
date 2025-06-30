import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByAddress(address: string): Promise<User>;
    update(id: string, updateData: Partial<User>): Promise<User>;
    remove(id: string): Promise<User>;
}
