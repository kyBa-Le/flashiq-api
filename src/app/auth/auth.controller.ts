import { Request, Response } from 'express';
import { createUser, verifyEmailService } from './auth.service';
import { RegisterDto } from './auth.dto';
import { sendVerifyEmail } from '../../utils/mail';
import { prisma } from '../../utils/prisma';

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
