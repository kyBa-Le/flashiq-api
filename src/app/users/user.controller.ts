import { Request, Response } from 'express';
import {
  extractPayloadFromAccessToken,
  getAccessTokenFromHeader,
} from '../../utils/jwtHelper';
import { getUserById } from '../auth/auth.service';
import { UserResponseDto } from './user.dto';
import { BaseException } from '../../errors/BaseException';

export const getCurrentUser = async (req: Request, res: Response) => {
  const token = getAccessTokenFromHeader(req);
  const userId = extractPayloadFromAccessToken(token).id;
  const user = await getUserById(userId);
  if (user === null) {
    throw new BaseException(400, 'User not found');
  }
  const userResponse: UserResponseDto = {
    id: user.id,
    username: user?.username,
    email: user.email,
    avatar: user?.avatar || '',
  };
  return res.status(200).json({
    message: 'Get current user successfully',
    data: userResponse,
  });
};
