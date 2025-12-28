import { CookieOptions } from 'express';

export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7일 (밀리초)
};
