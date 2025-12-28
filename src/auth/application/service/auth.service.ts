import { Injectable, UnauthorizedException, ConflictException, BadRequestException, Inject, Logger } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GetUserByEmailQuery, GetUserByIdQuery } from "../query/get-user.query";
import { User } from "src/auth/infrastructure/entity/user.entity";
import * as bcrypt from 'bcrypt';
import { CreateUserCommand } from "../command/create-user.command";
import { JwtTokenProvider, JwtPayload } from "src/auth/infrastructure/jwt-token.provider";
import type { IUserWriter } from "../adapter/iuser.writer";

const BCRYPT_SALT_ROUNDS = 10;

export interface AuthResult {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        nickname: string;
        profileImage: string | null;
    };
}

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
        private readonly jwtTokenProvider: JwtTokenProvider,
        @Inject('USER_WRITER') private readonly userWriter: IUserWriter,
    ) {}

    // ============================================
    // 일반 회원가입
    // ============================================
    async signup(
        email: string,
        password: string,
        nickname: string,
    ): Promise<AuthResult> {
        const existingUser = await this.queryBus.execute<GetUserByEmailQuery, User | null>(
            new GetUserByEmailQuery(email)
        );

        if (existingUser) {
            throw new ConflictException('이미 사용 중인 이메일입니다');
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

        const user = await this.commandBus.execute<CreateUserCommand, User>(
            new CreateUserCommand(email, hashedPassword, nickname),
        );

        const tokens = this.jwtTokenProvider.generateTokens(user.id);

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: user.id,
                email: user.email,
                nickname: user.nickname,
                profileImage: user.profileImage,
            },
        };
    }

    // ============================================
    // 일반 로그인
    // ============================================
    async login(email: string, password: string): Promise<AuthResult> {
        const user = await this.queryBus.execute<GetUserByEmailQuery, User | null>(
            new GetUserByEmailQuery(email)
        );

        if (!user) {
            throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다');
        }

        // 소셜 로그인 전용 계정 확인
        if (!user.password) {
            throw new UnauthorizedException(
                '소셜 로그인으로 가입된 계정입니다. 카카오 로그인을 이용해주세요',
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다');
        }

        const tokens = this.jwtTokenProvider.generateTokens(user.id);

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: user.id,
                email: user.email,
                nickname: user.nickname,
                profileImage: user.profileImage,
            },
        };
    }

    // ============================================
    // 토큰 갱신
    // ============================================
    refresh(refreshToken: string): { accessToken: string } {
        try {
            const payload = this.jwtTokenProvider.verifyToken(refreshToken);

            if (payload.type !== 'refresh') {
                throw new UnauthorizedException('Invalid token type');
            }

            const { accessToken } = this.jwtTokenProvider.generateTokens(payload.sub);
            return { accessToken };
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    // ============================================
    // 비밀번호 재설정 요청
    // ============================================
    async requestPasswordReset(email: string): Promise<void> {
        const user = await this.queryBus.execute<GetUserByEmailQuery, User | null>(
            new GetUserByEmailQuery(email)
        );

        // 보안상 사용자 존재 여부와 관계없이 조용히 리턴
        if (!user) return;

        // 소셜 로그인 계정은 비밀번호 재설정 불가
        if (!user.password) return;

        // 재설정 토큰 생성 (1시간 유효)
        const resetToken = this.jwtTokenProvider.generatePasswordResetToken(user.id);

        // TODO: 이메일 발송 서비스 구현 필요
        // await this.mailService.sendPasswordResetEmail(user.email, resetToken);

        // 개발 환경에서는 콘솔에 토큰 출력
        this.logger.log(`[DEV] Password reset token for ${email}: ${resetToken}`);
    }

    // ============================================
    // 비밀번호 재설정
    // ============================================
    async resetPassword(token: string, newPassword: string): Promise<void> {
        // 토큰 검증
        let payload: JwtPayload;
        try {
            payload = this.jwtTokenProvider.verifyToken(token);
        } catch {
            throw new BadRequestException('유효하지 않은 재설정 링크입니다');
        }

        if (payload.type !== 'password-reset') {
            throw new BadRequestException('유효하지 않은 재설정 링크입니다');
        }

        // 사용자 조회
        const user = await this.queryBus.execute<GetUserByIdQuery, User | null>(
            new GetUserByIdQuery(payload.sub)
        );

        if (!user) {
            throw new BadRequestException('유효하지 않은 재설정 링크입니다');
        }

        // 소셜 계정 체크
        if (!user.password) {
            throw new BadRequestException('소셜 로그인 계정은 비밀번호를 재설정할 수 없습니다');
        }

        // 비밀번호 변경
        user.password = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
        await this.userWriter.save(user);
    }
}
