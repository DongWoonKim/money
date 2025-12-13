
export class CreateUserDto {
    email: string;
    password: string;  // 해시된 비밀번호
    nickname: string;
}