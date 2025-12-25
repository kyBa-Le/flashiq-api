import {
  extractPayloadFromAccessToken,
  getAccessTokenFromHeader,
} from '../../utils/jwtHelper';
import { SetService } from './sets.service';
import { Request, Response } from 'express';

export const SetController = {
  async create(req: Request, res: Response) {
    try {
      const data = await SetService.createSet(req.body);
      const { id, title, description, isPublic, ownerId } = data;
      return res.status(201).json({
        message: 'Created set successfully',
        data: { id, title, description, isPublic, ownerId },
      });
    } catch (error: any) {
      console.error('Create Set Error:', error);
      return res.status(400).json({
        message: 'Failed to create set',
        error: error.message || 'Unknown error',
      });
    }
  },

  async getSetByUser(req: Request, res: Response) {
    try {
      const token = getAccessTokenFromHeader(req);
      const currentUserId = extractPayloadFromAccessToken(token).id;
      const userId = req.params.userId;
      if (currentUserId !== userId) {
        return res
          .status(403)
          .json({ message: 'You do not have permission to view this data' });
      }
      const userSets = await SetService.findByUserId(userId);
      return res.status(200).json({
        message: 'Data retrieved successfully',
        data: userSets,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: 'Server error',
        error: error.message,
      });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const inclueCards = req.query.inclueCards === 'true';
      const data = await SetService.findById(id, inclueCards);

      if (!data) {
        return res.status(404).json({
          message: 'Resource not found',
          error: `Set with id ${id} does not exist`,
        });
      }

      return res.status(200).json({
        message: 'Data retrieval successful',
        data,
      });
    } catch (error: any) {
      console.error('Get Set Error:', error);
      return res.status(500).json({
        message: 'Internal server error',
        error: error.message || 'Data cannot be retrieved.',
      });
    }
  },

  async updateSet(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await SetService.updateSet(id, req.body);

      if (!data) {
        return res.status(404).json({
          message: 'Update failed',
          error: 'Set not found',
        });
      }

      return res.status(200).json({
        message: 'Updated successfully',
        data,
      });
    } catch (error: any) {
      console.error('Update Set Error:', error);
      return res.status(400).json({
        message: 'Validation error',
        error: error.message || 'Update failed',
      });
    }
  },

  async deleteSet(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await SetService.deleteSet(id);

      if (!data) {
        return res.status(404).json({
          message: 'Delete failed',
          error: 'Set not found',
        });
      }
      return res.status(200).json({
        message: `Deleted the set ${data.title} successfully`,
        data: '',
      });
    } catch (error: any) {
      console.error('Delete Set Error:', error);
      return res.status(400).json({
        message: 'Erase failure',
        error: error.message,
      });
    }
  },
};
