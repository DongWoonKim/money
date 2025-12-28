import { User } from "src/auth/infrastructure/entity/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";

export interface IUserWriter {
    // Define methods for writing user data
    createUser(dto: CreateUserDto): Promise<User>;
    save(user: User): Promise<User>;
}