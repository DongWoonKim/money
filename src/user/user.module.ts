import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { UserController } from './interface/http/user.controller';
import { UserService } from './application/service/user.service';
import { UpdateNicknameHandler } from './application/command/handler/update-nickname.handler';
import { UpdatePasswordHandler } from './application/command/handler/update-password.handler';
import { User } from 'src/auth/infrastructure/entity/user.entity';
import { UserReader } from 'src/auth/infrastructure/persistence/user.reader';
import { UserWriter } from 'src/auth/infrastructure/persistence/user.writer';

const CommandHandlers = [
  UpdateNicknameHandler,
  UpdatePasswordHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CqrsModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    ...CommandHandlers,
    { provide: 'USER_READER', useClass: UserReader },
    { provide: 'USER_WRITER', useClass: UserWriter },
  ],
})
export class UserModule {}
