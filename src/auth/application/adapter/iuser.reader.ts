import { User } from "src/auth/infrastructure/entity/user.entity";

export interface IUserReader {
    // Define methods for reading user data
    findById(userId: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
}