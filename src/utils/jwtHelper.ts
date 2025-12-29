import { User } from '@prisma/client';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../app/auth/auth.type';
import { BaseException } from '../errors/BaseException';

export const generateToken = (user: User) => {
  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { accessToken, refreshToken };
};

export const validateRefreshToken = (token: string) => {
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
};

export const generateAccessToken = (payload: any) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '15m',
  });
  return accessToken;
};

export const generateRefreshToken = (payload: any) => {
  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: '7d',
    }
  );
  return refreshToken;
};

export const extractPayloadFromAccessToken = (token: string) => {
  const payload: TokenPayload = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as TokenPayload;
  return payload;
};

export const extractPayloadFromRefreshToken = (token: string) => {
  const payload: TokenPayload = jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET as string
  ) as TokenPayload;
  return payload;
};

export const getAccessTokenFromHeader = (req: Request) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    throw new BaseException(401, 'Unauthenticated request');
  } else {
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new BaseException(401, 'Unauthenticated request');
    }
    return token;
  }
};
