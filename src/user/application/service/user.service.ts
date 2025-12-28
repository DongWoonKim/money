import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateNicknameCommand } from '../command/update-nickname.command';
import { UpdatePasswordCommand } from '../command/update-password.command';
import { User } from 'src/auth/infrastructure/entity/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly commandBus: CommandBus) {}

  async updateNickname(userId: string, nickname: string): Promise<User> {
    return this.commandBus.execute(new UpdateNicknameCommand(userId, nickname));
  }

  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdatePasswordCommand(userId, currentPassword, newPassword)
    );
  }
}
