import {
  extractPayloadFromAccessToken,
  getAccessTokenFromHeader,
} from '../../utils/jwtHelper';
import { SetService } from './set.service';
import { Request, Response } from 'express';

export const SetController = {
  async create(req: Request, res: Response) {
    try {
      const token = getAccessTokenFromHeader(req);
      const payload = extractPayloadFromAccessToken(token);

      const createData = { ...req.body, ownerId: payload.id };
      const data = await SetService.createSet(createData);

      return res.status(201).json({
        message: 'Created set successfully',
        data: data,
      });
    } catch (error) {
      const err = error as { status?: number; message?: string };
      const status = err.status || 400;
      return res.status(status).json({
        message:
          status === 500
            ? 'Some error occur while processing request'
            : 'Failed to create set',
        error: err.message,
      });
    }
  },

  async getSetByUser(req: Request, res: Response) {
    try {
      const token = getAccessTokenFromHeader(req);
      const payload = extractPayloadFromAccessToken(token);
      const currentUserId = payload.id;
      const userId = req.params.userId;

      if (currentUserId !== userId) {
        throw {
          status: 403,
          message: 'You do not have permission to view this data',
        };
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await SetService.findByUserId(userId, page, limit);

      return res.status(200).json({
        message: 'Data retrieved successfully',
        data: result.sets,
        pagination: {
          totalItems: result.totalItems,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          limit: limit,
        },
      });
    } catch (error) {
      const err = error as { status?: number; message?: string };
      const status = err.status || 500;
      return res.status(status).json({
        message:
          status === 500
            ? 'Some error occur while processing request'
            : err.message,
        error: status === 500 ? 'Internal Server Error' : err.message,
      });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const inclueCards = req.query.inclueCards === 'true';
      const data = await SetService.findById(id, inclueCards);

      if (!data) {
        throw {
          status: 404,
          message: `Resource not found: Set with id ${id} does not exist`,
        };
      }

      return res.status(200).json({
        message: 'Data retrieval successful',
        data,
      });
    } catch (error) {
      const err = error as { status?: number; message?: string };
      const status = err.status || 500;
      return res.status(status).json({
        message:
          status === 500
            ? 'Some error occur while processing request'
            : err.message,
        error: status === 500 ? 'Internal Server Error' : err.message,
      });
    }
  },

  async updateSet(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const token = getAccessTokenFromHeader(req);
      const payload = extractPayloadFromAccessToken(token);
      const currentUserId = payload.id;

      const data = await SetService.updateSet(id, currentUserId, req.body);

      return res.status(200).json({ message: 'Updated successfully', data });
    } catch (error) {
      const err = error as { status?: number; message?: string };
      const status = err.status || 500;
      return res.status(status).json({
        message:
          status === 500
            ? 'Some error occur while processing request'
            : err.message,
        error: err.message,
      });
    }
  },

  async deleteSet(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const token = getAccessTokenFromHeader(req);
      if (!token) {
        throw { status: 401, message: 'Unauthorized: No token provided' };
      }

      const payload = extractPayloadFromAccessToken(token);
      if (!payload?.id) {
        throw { status: 401, message: 'Unauthorized: Invalid token' };
      }
      const currentUserId = payload.id;

      const deletedSet = await SetService.deleteSet(id, currentUserId);

      return res.status(200).json({
        message: `Deleted the set ${deletedSet.title} successfully`,
        data: null,
      });
    } catch (error) {
      const err = error as { status?: number; message?: string };
      const status = err.status || 500;

      return res.status(status).json({
        message:
          status === 500
            ? 'Some error occur while processing request'
            : err.message,
        error: status === 500 ? 'Internal Server Error' : err.message,
      });
    }
  },
};
