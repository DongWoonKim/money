import { Body, Controller, Post, HttpCode, HttpStatus, Res, Req, UnauthorizedException } from "@nestjs/common";
import type { Response, Request } from 'express';
import { AuthService } from "src/auth/application/service/auth.service";
import { SignupRequestDto } from "../dto/signup.request.dto";
import { LoginRequestDto } from "../dto/login.request.dto";
import { LoginResponseDto, RefreshResponseDto } from "../dto/auth.response.dto";
import { PasswordResetRequestDto } from "../dto/password-reset-request.dto";
import { PasswordResetDto } from "../dto/password-reset.dto";
import { REFRESH_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_OPTIONS } from "src/auth/constants/cookie.constants";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async signup(
        @Body() dto: SignupRequestDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<LoginResponseDto> {
        const { accessToken, refreshToken, user } = await this.authService.signup(
            dto.email, dto.password, dto.nickname
        );

        res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

        return { accessToken, user };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() dto: LoginRequestDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<LoginResponseDto> {
        const { accessToken, refreshToken, user } = await this.authService.login(
            dto.email, dto.password
        );

        res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

        return { accessToken, user };
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refresh(@Req() req: Request): RefreshResponseDto {
        const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found');
        }

        return this.authService.refresh(refreshToken);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Res({ passthrough: true }) res: Response): { message: string } {
        res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
            ...REFRESH_TOKEN_COOKIE_OPTIONS,
            maxAge: 0,
        });

        return { message: '로그아웃 성공' };
    }

    @Post('password/reset-request')
    @HttpCode(HttpStatus.OK)
    async requestPasswordReset(
        @Body() dto: PasswordResetRequestDto,
    ): Promise<{ message: string }> {
        await this.authService.requestPasswordReset(dto.email);
        return { message: '비밀번호 재설정 이메일을 전송했습니다' };
    }

    @Post('password/reset')
    @HttpCode(HttpStatus.OK)
    async resetPassword(
        @Body() dto: PasswordResetDto,
    ): Promise<{ message: string }> {
        await this.authService.resetPassword(dto.token, dto.newPassword);
        return { message: '비밀번호가 재설정되었습니다' };
    }
}
