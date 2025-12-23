import {
  findByEmail,
  createUser as createNewUser,
  findUserByVerifyToken,
  markEmailAsVerified,
} from './auth.repository';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

export const createUser = async (
  email: string,
  password: string,
  name: string
) => {
  const existingUser = await findByEmail(email);
  if (existingUser) {
    throw new Error('Email already exists');
  }
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  const emailVerifyToken = crypto.randomBytes(32).toString('hex');
  const emailVerifyExpiry = new Date(Date.now() + 15 * 60 * 1000);
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
