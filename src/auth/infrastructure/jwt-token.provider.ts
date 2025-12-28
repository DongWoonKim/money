import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

export interface JwtPayload {
  sub: string;
  type: 'access' | 'refresh' | 'password-reset';
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class JwtTokenProvider {
  private readonly accessExpiresIn: number;
  private readonly refreshExpiresIn: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessExpiresIn = this.parseExpiresIn(
      this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '1h')
    );
    this.refreshExpiresIn = this.parseExpiresIn(
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d')
    );
  }

  generateTokens(userId: string): TokenPair {
    const accessToken = this.jwtService.sign(
      { sub: userId, type: 'access' },
      { expiresIn: this.accessExpiresIn } as JwtSignOptions,
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId, type: 'refresh' },
      { expiresIn: this.refreshExpiresIn } as JwtSignOptions,
    );

    return { accessToken, refreshToken };
  }

  verifyToken(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token);
  }

  generatePasswordResetToken(userId: string): string {
    return this.jwtService.sign(
      { sub: userId, type: 'password-reset' },
      { expiresIn: 3600 } as JwtSignOptions, // 1시간
    );
  }

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  getRefreshTokenExpiresAt(): Date {
    return new Date(Date.now() + this.refreshExpiresIn * 1000);
  }

  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 7 * 24 * 60 * 60; // 7일 (초 단위)

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 60 * 60;
      case 'd': return value * 24 * 60 * 60;
      default: return 7 * 24 * 60 * 60;
    }
  }
}
