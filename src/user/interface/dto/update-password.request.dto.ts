import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdatePasswordRequestDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다' })
  @MaxLength(50, { message: '비밀번호는 최대 50자 이하여야 합니다' })
  @Matches(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/,
    { message: '비밀번호는 영문, 숫자, 특수문자(!@#$%^&*)를 포함해야 합니다' }
  )
  newPassword: string;
}
