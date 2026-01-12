import { prisma } from '../../utils/prisma';
import { ShareSetDto, UpdatePermissionDto } from './access.dto';

export const AccessRepository = {
  async grantAccess(data: ShareSetDto) {
    return await prisma.access.upsert({
      where: {
        setId_userId: {
          setId: data.setId,
          userId: data.userId,
        },
      },
      update: { permission: data.permission },
      create: {
        setId: data.setId,
        userId: data.userId,
        permission: data.permission,
      },
    });
  },

  async findAccess(setId: string, userId: string) {
    return await prisma.access.findUnique({
      where: {
        setId_userId: { setId, userId },
      },
    });
  },

  async getSetShared(setId: string) {
    return await prisma.access.findMany({
      where: { setId },
      include: {
        user: {
          select: { id: true, username: true, avatar: true, email: true },
        },
      },
    });
  },

  async updatePermission(accessId: string, data: UpdatePermissionDto) {
    return await prisma.access.update({
      where: { id: accessId },
      data: { permission: data.permission },
    });
  },

  async revokeAccess(accessId: string) {
    return await prisma.access.delete({
      where: { id: accessId },
    });
  },
};
