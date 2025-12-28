import { Controller, Patch, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from 'src/user/application/service/user.service';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { User } from 'src/auth/infrastructure/entity/user.entity';
import { UpdateNicknameRequestDto } from '../dto/update-nickname.request.dto';
import { UpdatePasswordRequestDto } from '../dto/update-password.request.dto';
import { UserResponseDto } from '../dto/user.response.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('me/nickname')
  @HttpCode(HttpStatus.OK)
  async updateNickname(
    @CurrentUser() user: User,
    @Body() dto: UpdateNicknameRequestDto,
  ): Promise<UserResponseDto> {
    const updated = await this.userService.updateNickname(user.id, dto.nickname);
    return {
      id: updated.id,
      email: updated.email,
      nickname: updated.nickname,
      profileImage: updated.profileImage,
    };
  }

  @Patch('me/password')
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @CurrentUser() user: User,
    @Body() dto: UpdatePasswordRequestDto,
  ): Promise<{ message: string }> {
    await this.userService.updatePassword(
      user.id,
      dto.currentPassword,
      dto.newPassword,
    );
    return { message: '비밀번호가 변경되었습니다' };
  }
}
