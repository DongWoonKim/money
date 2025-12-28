import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { AuthController } from "./interface/http/auth.controller";
import { UserReader } from "./infrastructure/persistence/user.reader";
import { UserWriter } from "./infrastructure/persistence/user.writer";
import { AuthService } from "./application/service/auth.service";
import { GetUserByEmailQueryHandler, GetUserByIdQueryHandler } from "./application/query/handler/get-user.handler";
import { CreateUserCommandHandler } from "./application/command/handler/create-user.handler";
import { User } from "./infrastructure/entity/user.entity";
import { JwtTokenProvider } from "./infrastructure/jwt-token.provider";
import { JwtStrategy } from "./infrastructure/jwt.strategy";

const CommandHandlers = [
    CreateUserCommandHandler,
];

const QueryHandlers = [
    GetUserByIdQueryHandler,
    GetUserByEmailQueryHandler
];

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        CqrsModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET', 'your-super-secret-key-change-in-production'),
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtTokenProvider,
        JwtStrategy,
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
    exports: [AuthService, JwtStrategy]
})
export class AuthModule {}
