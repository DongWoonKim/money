import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GetUserByEmailQuery } from "../query/get-user.query";
import { User } from "src/auth/infrastructure/entity/user.entity";
import bcrypt from 'bcrypt';
import { CreateUserCommand } from "../command/create-user.command";

const BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) {}
    
    // ============================================
    // 일반 회원가입
    // ============================================
    async signup(
        email: string,
        password: string,
        nickname: string,
    ): Promise<void> {
        // 회원가입 로직 구현
        const existingUser = await this.queryBus.execute<GetUserByEmailQuery, User | null>(
            new GetUserByEmailQuery(email)
        );

        if (existingUser) {
            throw new Error('Email already in use');
        }
        
        const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

        const user = await this.commandBus.execute<CreateUserCommand, User>(
            new CreateUserCommand(email, hashedPassword, nickname),
        );

        console.log(user);
    }

}
