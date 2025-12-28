import { IsString, Length } from 'class-validator';

export class UpdateNicknameRequestDto {
  @IsString()
  @Length(2, 100, { message: '닉네임은 2자 이상 100자 이하여야 합니다' })
  nickname: string;
}
