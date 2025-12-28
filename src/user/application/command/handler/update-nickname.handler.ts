import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateNicknameCommand } from '../update-nickname.command';
import type { IUserWriter } from 'src/auth/application/adapter/iuser.writer';
import { GetUserByIdQuery } from 'src/auth/application/query/get-user.query';
import { User } from 'src/auth/infrastructure/entity/user.entity';

@CommandHandler(UpdateNicknameCommand)
export class UpdateNicknameHandler implements ICommandHandler<UpdateNicknameCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject('USER_WRITER') private readonly userWriter: IUserWriter,
  ) {}

  async execute(command: UpdateNicknameCommand): Promise<User> {
    const user = await this.queryBus.execute<GetUserByIdQuery, User | null>(
      new GetUserByIdQuery(command.userId)
    );

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다');
    }

    user.nickname = command.nickname;
    return this.userWriter.save(user);
  }
}
