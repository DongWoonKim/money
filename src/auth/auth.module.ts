import { Module } from "@nestjs/common";
import { AuthController } from "./interface/http/auth.controller";
import { UserReader } from "./infrastructure/persistence/user.reader";
import { UserWriter } from "./infrastructure/persistence/user.writer";
import { AuthService } from "./application/service/auth.service";
import { GetUserByEmailQueryHandler, GetUserByIdQueryHandler } from "./application/query/handler/get-user.handler";
import { CreateUserCommandHandler } from "./application/command/handler/create-user.handler";

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