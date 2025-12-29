import {
  findByEmail,
  createUser as createNewUser,
  findUserByVerifyToken,
  markEmailAsVerified,
  updateVerifyToken,
  findById,
  removeUserToken,
} from './auth.repository';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { ENV } from '../../config/env';
import { BaseException } from '../../errors/BaseException';

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

export const deleteTokenByUseId = async (userId: string) => {
  try {
    return await removeUserToken(userId);
  } catch (error: any) {
    throw new BaseException(500, error.message);
  }
};
