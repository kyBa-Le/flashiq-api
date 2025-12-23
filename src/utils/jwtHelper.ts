import { User } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
export const generateToken = (user: User) => {
  const payload: JwtPayload = {
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
  const payload = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtPayload;
  return payload;
};

export const extractPayloadFromRefreshToken = (token: string) => {
  const payload = jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET as string
  ) as JwtPayload;
  return payload;
};
