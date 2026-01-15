import { NextFunction, Request, Response } from 'express';
import { Access, Set } from '@prisma/client';
import {
  getAccessTokenFromHeader,
  extractPayloadFromAccessToken,
} from '../utils/jwtHelper';
import { BaseException } from '../errors/BaseException';
import { findSetById } from '../app/cards/card.repository';
import { AccessRepository } from '../app/access/access.repository';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = getAccessTokenFromHeader(req);
    const payload = extractPayloadFromAccessToken(token);

    req.user = {
      id: payload.id,
    };

    next();
  } catch {
    return res.status(401).json({
      message: 'Unauthenticated request',
    });
  }
};

const permissionRank = {
  VIEW: 1,
  EDIT: 2,
  OWNER: 3,
} as const;

export type SetPermission = keyof typeof permissionRank;

export const authorizeSetPermission =
  (requiredPermission: SetPermission) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const setId = req.params.id;
    const userId = req.user!.id;

    const set: Set | null = await findSetById(setId);

    if (!set) {
      throw new BaseException(404, 'Set not found');
    }

    if (set.ownerId === userId) {
      return next();
    }

    if (set.isPublic && requiredPermission === 'VIEW') {
      return next();
    }

    const access: Access | null = await AccessRepository.findAccess(
      setId,
      userId
    );

    if (!access) {
      throw new BaseException(403, 'Access denied');
    }

    if (
      permissionRank[access.permission] < permissionRank[requiredPermission]
    ) {
      throw new BaseException(403, 'Access denied');
    }

    next();
  };
