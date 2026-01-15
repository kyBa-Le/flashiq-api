import { Request, Response, NextFunction } from 'express';
import { AccessService } from './access.service';
import { AccessRepository } from './access.repository';
import { SetRepository } from '../sets/set.repository';
import { BaseException } from '../../errors/BaseException';

export const AccessController = {
  async share(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AccessService.shareSet(req.user!.id, req.body);
      return res
        .status(200)
        .json({ message: 'Shared successfully', data: result });
    } catch (error) {
      next(error);
    }
  },

  async getShared(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await AccessService.getAllInforShared(id, req.user!.id);
      return res.status(200).json({ message: 'Retrieve successfully', data });
    } catch (error) {
      next(error);
    }
  },

  async removeAccess(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await AccessService.revokeAccess(id, req.user!.id);
      return res.status(200).json({ message: 'Access revoked successfully' });
    } catch (error) {
      next(error);
    }
  },

  async getCurrentSetPermission(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const set = await SetRepository.findById(id, false);

      if (!set) {
        throw new BaseException(404, 'Set not found');
      }

      if (set.ownerId === userId) {
        return res.status(200).json({
          message: 'Permission retrieved successfully',
          data: {
            setId: set.id,
            permission: 'OWNER',
            userId: userId,
          },
        });
      }

      const access = await AccessRepository.findAccess(id, userId);

      if (!access) {
        throw new BaseException(404, 'No access permission found for this set');
      }

      return res.status(200).json({
        message: 'Permission retrieved successfully',
        data: {
          setId: access.setId,
          permission: access.permission,
          userId: access.userId,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
