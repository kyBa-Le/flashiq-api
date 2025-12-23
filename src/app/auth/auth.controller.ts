import { Request, Response } from 'express';
import {
  createUser,
  verifyEmailService,
  resendVerificationEmail as resendVerificationEmailService,
  findByEmailAndPassword,
  getUserById,
} from './auth.service';
import { RegisterDto } from './auth.dto';
import { sendVerifyEmail } from '../../utils/mail';
import { prisma } from '../../utils/prisma';
import {
  extractPayloadFromRefreshToken,
  generateAccessToken,
  generateToken,
  validateRefreshToken,
} from '../../utils/jwtHelper';

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

    if ((error as Error).message === 'Email already exists') {
      return res.status(400).json({
        message: 'Email already exists',
      });
    }

    if ((error as Error).message === 'Failed to send verification email') {
      return res.status(500).json({
        message: 'Failed to send verification email. Please try again.',
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
      error: (error as Error).message,
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    await verifyEmailService(token as string);

    return res.json({
      message: 'Email verified successfully',
    });
  } catch (error: any) {
    if (error.message === 'INVALID_TOKEN') {
      return res.status(400).json({ message: 'Invalid token' });
    }
    if (error.message === 'TOKEN_EXPIRED') {
      return res.status(400).json({ message: 'Token has expired' });
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
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
      const accessToken = generateToken(user).accessToken;
      const refreshToken = generateToken(user).refreshToken;

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await prisma.refreshToken.create({
        data: {
          refreshToken: refreshToken,
          userId: user.id,
          expiresAt: expiresAt,
          createdAt: new Date(),
        },
      });
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
  try {
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

    const payload = {
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
  } catch (error: any) {
    return res.status(500).json({
      message: 'Some errors occur while processing request',
      errors: [error.message],
    });
  }
};
