import { prisma } from '../../utils/prisma';

export const findByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user;
};

export const createUser = async (
  email: string,
  password: string | null,
  name: string,
  salt: string | null,
  emailVerifyToken: string | null,
  emailVerifyExpiry: Date | null,
  googleId: string | null = null
) => {
  const user = await prisma.user.create({
    data: {
      email: email,
      password: password,
      username: name,
      salt: salt,
      avatar: '',
      emailVerifyToken: emailVerifyToken,
      emailVerifyExpiry: emailVerifyExpiry,
      googleId: googleId,
    },
  });
  return user;
};

export const findUserByVerifyToken = async (token: string) => {
  return await prisma.user.findFirst({
    where: {
      emailVerifyToken: token,
    },
  });
};

export const markEmailAsVerified = async (userId: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      isEmailVerified: true,
      emailVerifyToken: null,
      emailVerifyExpiry: null,
    },
  });
};

export const updateVerifyToken = async (
  userId: string,
  token: string,
  expiry: Date
) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      emailVerifyToken: token,
      emailVerifyExpiry: expiry,
    },
  });
};

export const findById = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
};

export const removeSpecificToken = async (refreshToken: string) => {
  return await prisma.refreshToken.delete({
    where: { refreshToken: refreshToken },
  });
};

export const createRefreshToken = async (refreshToken: string, id: string) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  return await prisma.refreshToken.create({
    data: {
      refreshToken: refreshToken,
      userId: id,
      expiresAt: expiresAt,
      createdAt: new Date(),
    },
  });
};
