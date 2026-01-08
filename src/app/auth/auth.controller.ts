import { Request, Response } from 'express';
import {
  createUser,
  verifyEmailService,
  resendVerificationEmail as resendVerificationEmailService,
  findByEmailAndPassword,
  getUserById,
  removeRefreshToken,
  loginUser,
  findUserByGoogleTokenPayload,
} from './auth.service';
import { RegisterDto } from './auth.dto';
import { sendVerifyEmail } from '../../utils/mail';
import { prisma } from '../../utils/prisma';
import {
  extractPayloadFromRefreshToken,
  generateAccessToken,
  validateRefreshToken,
} from '../../utils/jwtHelper';
import { TokenPayload } from './auth.type';
import { BaseSuccessResponse } from '../../dto/SuccessResponse';
import { extractPayloadFromGoogleIdToken } from './auth.util';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;
    const result = await prisma.$transaction(
      async () => {
        const newUser = await createUser(email, password, username);
        try {
          await sendVerifyEmail(
            newUser.email,
            newUser.username,
            newUser.emailVerifyToken!
          );
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
          throw new Error('Failed to send verification email');
        }
        return newUser;
      },
      {
        timeout: 20000,
      }
    );
    const userResponse: RegisterDto = {
      username: result.username,
      email: result.email,
      createdAt: result.createdAt,
    };

    return res.status(201).json({
      message: 'User created successfully',
      user: userResponse,
    });
  } catch (error) {
    console.error('Registration error:', error);

    if ((error as Error).message === 'Failed to send verification email') {
      return res.status(500).json({
        message: 'Failed to send verification email. Please try again.',
      });
    } else {
      throw error;
    }
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const redirectUrl = process.env.FRONTEND_APP as string;
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    await verifyEmailService(token as string);

    return res.redirect(redirectUrl + '/verification-success');
  } catch (error: any) {
    if (error.message === 'INVALID_TOKEN') {
      return res.redirect(redirectUrl + '/verification-failed?status=invalid');
    }
    if (error.message === 'TOKEN_EXPIRED') {
      return res.redirect(redirectUrl + '/verification-failed?status=expired');
    }

    return res.status(500).send('<h1/>Internal server error</h1>');
  }
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const { emailVerifyToken, user } =
      await resendVerificationEmailService(email);

    await sendVerifyEmail(user.email, user.username, emailVerifyToken);

    return res.json({
      message: 'Verification email sent successfully',
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ message: 'User not found' });
      }
      if (error.message === 'Email already verified') {
        return res.status(400).json({ message: 'Email already verified' });
      }
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await findByEmailAndPassword(email, password);
    if (user) {
      const { accessToken, refreshToken } = await loginUser(user);
      return res.json({
        message: 'Login successfully',
        data: {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });
    } else {
      return res.status(400).json({
        message: 'Email or password is incorrect',
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: 'Some errors occur while processing request',
      errors: [error.message],
    });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).send('No token found');
  validateRefreshToken(refreshToken);

  const userId = extractPayloadFromRefreshToken(refreshToken).id;
  const user = await getUserById(userId);
  if (!user) {
    return res.status(400).json({
      message: 'Refresh token is invalid',
    });
  }

  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
  };
  const accessToken = generateAccessToken(payload);
  return res.status(200).json({
    message: 'Refresh token successfully',
    data: {
      accessToken: accessToken,
    },
  });
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  validateRefreshToken(refreshToken);
  await removeRefreshToken(refreshToken);
  return res.json({
    message: 'Logout successfully',
    data: [],
  });
};

export const googleLogin = async (req: Request, res: Response) => {
  const { token } = req.body;
  const payload = await extractPayloadFromGoogleIdToken(token);
  const user = await findUserByGoogleTokenPayload(payload);
  const tokens = await loginUser(user);
  const response = new BaseSuccessResponse('Login successfully', tokens);
  return res.json(response);
};
