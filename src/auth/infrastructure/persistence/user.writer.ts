import { Injectable } from "@nestjs/common";
import { IUserWriter } from "src/auth/application/adapter/iuser.writer";
import { CreateUserDto } from "src/auth/application/dto/create-user.dto";
import { User } from "../entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserWriter implements IUserWriter {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    createUser(dto: CreateUserDto): Promise<User> {
         const user = this.userRepository.create({
            email: dto.email,
            password: dto.password,
            nickname: dto.nickname,
            kakaoId: null,
            profileImage: null,
        });
        return this.userRepository.save(user);
    }

    save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }
}   