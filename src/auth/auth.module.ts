import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CqrsModule } from "@nestjs/cqrs";
import { AuthController } from "./interface/http/auth.controller";
import { UserReader } from "./infrastructure/persistence/user.reader";
import { UserWriter } from "./infrastructure/persistence/user.writer";
import { AuthService } from "./application/service/auth.service";
import { GetUserByEmailQueryHandler, GetUserByIdQueryHandler } from "./application/query/handler/get-user.handler";
import { CreateUserCommandHandler } from "./application/command/handler/create-user.handler";
import { User } from "./infrastructure/entity/user.entity";

const CommandHandlers = [
    // Add command handlers here
    CreateUserCommandHandler,
];

const QueryHandlers = [
    // Add query handlers here
    GetUserByIdQueryHandler,
    GetUserByEmailQueryHandler
];

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),  // default 연결 사용
        CqrsModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        ...CommandHandlers,
        ...QueryHandlers,
        {
            provide : 'USER_READER',
            useClass:  UserReader
        },
        {
            provide : 'USER_WRITER',
            useClass:  UserWriter
        },
    ],
    exports: [AuthService]
})
export class AuthModule {}