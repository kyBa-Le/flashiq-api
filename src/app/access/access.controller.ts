import { Request, Response, NextFunction } from 'express';
import { AccessService } from './access.service';
import {
  extractPayloadFromAccessToken,
  getAccessTokenFromHeader,
} from '../../utils/jwtHelper';

export const AccessController = {
  async share(req: Request, res: Response, next: NextFunction) {
    try {
      const token = getAccessTokenFromHeader(req);
      const payload = extractPayloadFromAccessToken(token);

      const result = await AccessService.shareSet(payload.id, req.body);
      return res
        .status(200)
        .json({ message: 'Shared successfully', data: result });
    } catch (error) {
      next(error);
    }
  },

  async getShared(req: Request, res: Response, next: NextFunction) {
    try {
      const { setId } = req.params;
      const token = getAccessTokenFromHeader(req);
      const payload = extractPayloadFromAccessToken(token);

      const data = await AccessService.getAllInforShared(setId, payload.id);
      return res.status(200).json({ message: 'Retrieve successfully', data });
    } catch (error) {
      next(error);
    }
  },

  async removeAccess(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const token = getAccessTokenFromHeader(req);
      const payload = extractPayloadFromAccessToken(token);

      await AccessService.revokeAccess(id, payload.id);
      return res.status(200).json({ message: 'Access revoked successfully' });
    } catch (error) {
      next(error);
    }
  },
};
