import { Request, Response } from 'express';
import {
  extractPayloadFromAccessToken,
  getAccessTokenFromHeader,
} from '../../utils/jwtHelper';
import { SetService } from './set.service';

export const SetController = {
  async create(req: Request, res: Response) {
    const token = getAccessTokenFromHeader(req);
    const payload = extractPayloadFromAccessToken(token);

    const createData = { ...req.body, ownerId: payload.id };
    const data = await SetService.createSet(createData);

    return res.status(201).json({
      message: 'Created set successfully',
      data: data,
    });
  },

  async getSetByUser(req: Request, res: Response) {
    const token = getAccessTokenFromHeader(req);
    const payload = extractPayloadFromAccessToken(token);
    const currentUserId = payload.id;
    const userId = req.params.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await SetService.findByUserId(
      userId,
      currentUserId,
      page,
      limit
    );
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
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const includeCards = req.query.includeCards === 'true';
    const data = await SetService.findById(id, includeCards);

    return res.status(200).json({
      message: 'Data retrieval successful',
      data,
    });
  },

  async updateSet(req: Request, res: Response) {
    const { id } = req.params;
    const token = getAccessTokenFromHeader(req);
    const payload = extractPayloadFromAccessToken(token);
    const currentUserId = payload.id;

    const data = await SetService.updateSet(id, currentUserId, req.body);

    return res.status(200).json({ message: 'Updated successfully', data });
  },

  async deleteSet(req: Request, res: Response) {
    const { id } = req.params;
    const token = getAccessTokenFromHeader(req);
    const payload = extractPayloadFromAccessToken(token);
    const currentUserId = payload.id;

    const deletedSet = await SetService.deleteSet(id, currentUserId);

    return res.status(200).json({
      message: `Deleted the set ${deletedSet.title} successfully`,
      data: null,
    });
  },

  async search(req: Request, res: Response) {
    try {
      const keyword = req.query.q as string;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const response = await SetService.searchSets(keyword, page, limit);
      return res.status(200).json(response);
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      return res.status(err.status || 500).json({ message: err.message });
    }
  },

  async getTrending(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const data = await SetService.getTrendingSets(page, limit);
      return res
        .status(200)
        .json({ message: 'Trending sets retrieved successfully', ...data });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      return res.status(err.status || 500).json({ message: err.message });
    }
  },

  async getSharedSets(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const token = getAccessTokenFromHeader(req);
      const payload = extractPayloadFromAccessToken(token);
      const currentUserId = payload.id;

      const sets = await SetService.findSharedWithUser(userId, currentUserId);

      return res
        .status(200)
        .json({ message: 'Shared sets retrieved successfully', data: sets });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      return res.status(err.status || 500).json({ message: err.message });
    }
  },
};
