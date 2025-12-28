import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { Inject, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordCommand } from '../update-password.command';
import type { IUserWriter } from 'src/auth/application/adapter/iuser.writer';
import { GetUserByIdQuery } from 'src/auth/application/query/get-user.query';
import { User } from 'src/auth/infrastructure/entity/user.entity';

const BCRYPT_SALT_ROUNDS = 10;

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordHandler implements ICommandHandler<UpdatePasswordCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject('USER_WRITER') private readonly userWriter: IUserWriter,
  ) {}

  async execute(command: UpdatePasswordCommand): Promise<void> {
    const user = await this.queryBus.execute<GetUserByIdQuery, User | null>(
      new GetUserByIdQuery(command.userId)
    );

    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다');
    }

    // 소셜 로그인 계정 체크
    if (!user.password) {
      throw new UnauthorizedException('소셜 로그인 계정은 비밀번호를 변경할 수 없습니다');
    }

    // 현재 비밀번호 검증
    const isValid = await bcrypt.compare(command.currentPassword, user.password);
    if (!isValid) {
      throw new UnauthorizedException('현재 비밀번호가 올바르지 않습니다');
    }

    // 새 비밀번호 해싱 및 저장
    user.password = await bcrypt.hash(command.newPassword, BCRYPT_SALT_ROUNDS);
    await this.userWriter.save(user);
  }
}
