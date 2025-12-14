import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "src/auth/application/service/auth.service";

class SignupDto {
    email: string;
    password: string;
    nickname: string;
}

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('signup')
    async signup(@Body() dto: SignupDto) {
        await this.authService.signup(dto.email, dto.password, dto.nickname);
        return { message: 'User created successfully' };
    }
}