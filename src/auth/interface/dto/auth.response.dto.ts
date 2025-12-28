export class UserResponseDto {
  id: string;
  email: string;
  nickname: string;
  profileImage: string | null;
}

export class LoginResponseDto {
  accessToken: string;
  user: UserResponseDto;
}

export class RefreshResponseDto {
  accessToken: string;
}
