import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class SignupRequestDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다' })
  @IsNotEmpty({ message: '이메일을 입력해주세요' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다' })
  @MaxLength(50, { message: '비밀번호는 최대 50자까지 가능합니다' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
    message: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다',
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요' })
  @MinLength(2, { message: '닉네임은 최소 2자 이상이어야 합니다' })
  @MaxLength(100, { message: '닉네임은 최대 100자까지 가능합니다' })
  nickname: string;
}
