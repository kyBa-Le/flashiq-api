import { BaseSuccessResponse } from '../../dto/SuccessResponse';
import { BaseException } from '../../errors/BaseException';
import { CreateSetDto } from './set.dto';
import { SetRepository } from './set.repository';

export const SetService = {
  async createSet(data: CreateSetDto) {
    return await SetRepository.createSet(data);
  },

  async findByUserId(userId: string, page: number, limit: number) {
    return await SetRepository.findByUserId(userId, page, limit);
  },

  async findById(
    id: string,
    includeCards: boolean = false,
    currentUserId?: string
  ) {
    const set = await SetRepository.findById(id, includeCards);

    if (!set) return null;

    const isOwner =
      currentUserId && String(currentUserId) === String(set.ownerId);

    if (!isOwner) {
      try {
        await SetRepository.incrementViewCount(id);

        set.viewCount += 1;
      } catch (error) {
        console.error('Failed to increment view count:', error);
      }
    }

    return set;
  },

  async updateSet(
    setId: string,
    currentUserId: string,
    data: Partial<CreateSetDto>
  ) {
    const existingSet = await SetRepository.findById(setId, false);

    if (!existingSet) {
      const err = new Error('Set not found');
      (err as { status?: number }).status = 404;
      throw err;
    }

    if (existingSet.ownerId !== currentUserId) {
      const err = new Error('You do not have permission to update this set');
      (err as { status?: number }).status = 403;
      throw err;
    }

    return await SetRepository.updateSet(setId, data);
  },

  async deleteSet(setId: string, currentUserId: string) {
    const existingSet = await SetRepository.findById(setId, false);

    if (!existingSet) {
      const err = new Error('Set not found');
      (err as { status?: number }).status = 404;
      throw err;
    }

    if (existingSet.ownerId !== currentUserId) {
      const err = new Error('You do not have permission to delete this set');
      (err as { status?: number }).status = 403;
      throw err;
    }
    return await SetRepository.deleteSet(setId);
  },

  async searchSets(keyword: string, page: number, limit: number) {
    try {
      if (!keyword || keyword.trim() === '') {
        return new BaseSuccessResponse('No sets found matching your search', {
          sets: [],
        });
      }

      const { sets, totalItems } = await SetRepository.findByTitle(
        keyword,
        page,
        limit
      );

      if (sets.length === 0) {
        return new BaseSuccessResponse('No sets found matching your search', {
          sets: [],
        });
      }

      const totalPages = Math.ceil(totalItems / limit);
      const data = {
        sets,
        pagination: { totalItems, totalPages, currentPage: page, limit },
      };

      return new BaseSuccessResponse('Sets retrieved successfully', data);
    } catch (error) {
      const err = error as { status?: number; message?: string };
      throw new BaseException(
        err.status || 500,
        err.message || 'Internal server error'
      );
    }
  },

  async getTrendingSets(limit: number = 10) {
    try {
      return await SetRepository.findTopViewed(limit);
    } catch (_error) {
      throw {
        status: 500,
        message: 'Failed to retrieve popular sets',
      };
    }
  },
};
