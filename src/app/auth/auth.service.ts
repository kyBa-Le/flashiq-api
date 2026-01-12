import {
  findByEmail,
  createUser as createNewUser,
  findUserByVerifyToken,
  markEmailAsVerified,
  updateVerifyToken,
  findById,
  removeSpecificToken,
  createRefreshToken,
} from './auth.repository';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { ENV } from '../../config/env';
import { BaseException } from '../../errors/BaseException';
import { TokenPayload } from 'google-auth-library';
import { getUserByEmail, updateUserById } from '../users/user.respotitory';
import { verifyGoogleUserPayload } from './auth.util';
import { User } from '@prisma/client';
import { generateToken } from '../../utils/jwtHelper';

export const createUser = async (
  email: string,
  password: string,
  name: string
) => {
  const existingUser = await findByEmail(email);
  if (existingUser) {
    throw new BaseException(400, 'Email already exists');
  }
  const salt = await bcrypt.genSalt(ENV.BCRYPT_SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  const emailVerifyToken = crypto.randomBytes(32).toString('hex');
  const emailVerifyExpiry = new Date(
    Date.now() + ENV.EMAIL_VERIFY_EXPIRE_MINUTES * 60 * 1000
  );
  const user = await createNewUser(
    email,
    hashedPassword,
    name,
    salt,
    emailVerifyToken,
    emailVerifyExpiry
  );
  return user;
};

export const verifyEmailService = async (token: string) => {
  const user = await findUserByVerifyToken(token);

  if (!user) {
    throw new Error('INVALID_TOKEN');
  }

  if (user.emailVerifyExpiry && user.emailVerifyExpiry < new Date()) {
    throw new Error('TOKEN_EXPIRED');
  }

  await markEmailAsVerified(user.id);

  return { success: true };
};

export const resendVerificationEmail = async (email: string) => {
  const user = await findByEmail(email);

  if (!user) {
    throw new Error('User not found');
  }

  if (user.isEmailVerified) {
    throw new Error('Email already verified');
  }

  const emailVerifyToken = crypto.randomBytes(32).toString('hex');
  const emailVerifyExpiry = new Date(Date.now() + 15 * 60 * 1000);

  await updateVerifyToken(user.id, emailVerifyToken, emailVerifyExpiry);

  return { emailVerifyToken, user };
};

export const findByEmailAndPassword = async (
  email: string,
  password: string
) => {
  const user = await findByEmail(email);
  if (!user) {
    return null;
  }
  if (!user.password || !user.salt) {
    throw new Error("Users don't have password (they can login by google)");
  }
  const hashedPassword = await bcrypt.hash(password, user.salt);
  if (hashedPassword === user.password) {
    return user;
  }
  return null;
};

export const getUserById = async (id: string) => {
  const user = await findById(id);
  return user;
};

export const findUserByGoogleTokenPayload = async (
  userPayload: TokenPayload
) => {
  const { email, name, sub } = userPayload;
  verifyGoogleUserPayload(userPayload);

  let user = await getUserByEmail(email as string);
  if (!user) {
    user = await createNewUser(
      email as string,
      null,
      name as string,
      null,
      null,
      null,
      sub
    );
  } else {
    if (!user.googleId) {
      user.googleId = sub;
      user.isEmailVerified = true;
      user = await updateUserById(user.id, user);
    }
  }
  return user;
};

export const removeRefreshToken = async (refreshToken: string) => {
  try {
    if (!refreshToken) {
      throw new BaseException(400, 'Refresh token is required');
    }
    return await removeSpecificToken(refreshToken);
  } catch (error: any) {
    throw new BaseException(500, error.message);
  }
};

export const loginUser = async (user: User) => {
  const accessToken = generateToken(user).accessToken;
  const refreshToken = generateToken(user).refreshToken;
  await createRefreshToken(refreshToken, user.id);
  return { accessToken, refreshToken };
};
