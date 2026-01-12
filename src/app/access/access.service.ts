import { BaseException } from '../../errors/BaseException';
import { AccessRepository } from './access.repository';
import { SetRepository } from '../sets/set.repository';
import { ShareSetRequestDto } from './access.dto';
import { prisma } from '../../utils/prisma';

export const AccessService = {
  async shareSet(currentUserId: string, data: ShareSetRequestDto) {
    const { setId, email, permission } = data;

    const userToShare = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!userToShare) {
      throw new BaseException(
        404,
        'The user with this email address does not exist'
      );
    }

    const set = await SetRepository.findById(setId, false);
    if (!set || set.ownerId !== currentUserId) {
      throw new BaseException(
        403,
        'You are not allowed to share this set of cards'
      );
    }

    return await AccessRepository.grantAccess({
      setId,
      userId: userToShare.id,
      permission,
    });
  },

  async getAllInforShared(setId: string, currentUserId: string) {
    const set = await SetRepository.findById(setId, false);
    if (!set) throw new BaseException(404, 'Set not found');

    if (set.ownerId !== currentUserId) {
      throw new BaseException(403, 'Permission denied');
    }

    return await AccessRepository.getSetShared(setId);
  },

  async revokeAccess(accessId: string, currentUserId: string) {
    const access = await prisma.access.findUnique({
      where: { id: accessId },
      include: { set: true },
    });

    if (!access) throw new BaseException(404, 'Access record not found');
    if (access.set.ownerId !== currentUserId) {
      throw new BaseException(403, 'Only the owner can revoke access');
    }

    return await AccessRepository.revokeAccess(accessId);
  },
};
