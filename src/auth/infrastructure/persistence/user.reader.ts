import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IUserReader } from "src/auth/application/adapter/iuser.reader";
import { User } from "../entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserReader implements IUserReader {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    async findById(userId: string): Promise<User | null> {
        // Implementation for finding a user by ID
        return await this.userRepository.findOne({ where: { id : userId } }); // Placeholder return
    }

    async findByEmail(email: string): Promise<User | null> {
        // Implementation for finding a user by email
        return await this.userRepository.findOne({ where: { email : email } }); // Placeholder return
    }
}