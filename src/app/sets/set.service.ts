import { BaseSuccessResponse } from '../../dto/SuccessResponse';
import { BaseException } from '../../errors/BaseException';
import { CreateSetDto } from './set.dto';
import { SetRepository } from './set.repository';
import { getUserById } from '../auth/auth.service';

export const SetService = {
  async createSet(data: CreateSetDto) {
    try {
      if (!data) {
        throw new BaseException(400, 'Invalid data');
      }
      return await SetRepository.createSet(data);
    } catch (error: any) {
      if (error instanceof BaseException) {
        throw error;
      }

      throw new BaseException(
        error?.status || 500,
        error?.message || 'Internal server error'
      );
    }
  },
  async findByUserId(
    userId: string,
    currentUserId: string,
    page: number,
    limit: number
  ) {
    try {
      if (currentUserId !== userId) {
        throw new BaseException(
          403,
          'You do not have permission to view this data'
        );
      }

      return await SetRepository.findByUserId(userId, page, limit);
    } catch (error: any) {
      if (error instanceof BaseException) {
        throw error;
      }

      throw new BaseException(
        error?.status || 500,
        error?.message || 'Internal server error'
      );
    }
  },
  async findById(id: string, includeCards: boolean = false) {
    try {
      const set = await SetRepository.findById(id, includeCards);
      if (!set) {
        throw new BaseException(404, 'Set not found');
      }
      return set;
    } catch (error: any) {
      if (error instanceof BaseException) {
        throw error;
      }

      throw new BaseException(
        error?.status || 500,
        error?.message || 'Internal server error'
      );
    }
  },
  async updateSet(
    setId: string,
    currentUserId: string,
    data: Partial<CreateSetDto>
  ) {
    try {
      const existingSet = await SetRepository.findById(setId, false);

      if (!existingSet) {
        throw new BaseException(404, 'Set not found');
      }
      return await SetRepository.updateSet(setId, data);
    } catch (error: any) {
      if (error instanceof BaseException) {
        throw error;
      }

      throw new BaseException(
        error?.status || 500,
        error?.message || 'Internal server error'
      );
    }
  },

  async deleteSet(setId: string, currentUserId: string) {
    try {
      const existingSet = await SetRepository.findById(setId, false);
      if (!currentUserId) {
        throw new BaseException(401, 'Unauthorized');
      }
      if (!existingSet) {
        throw new BaseException(404, 'Set not found');
      }

      if (existingSet.ownerId !== currentUserId) {
        throw new BaseException(
          403,
          'You do not have permission to delete this set'
        );
      }
      return await SetRepository.deleteSet(setId);
    } catch (error: any) {
      if (error instanceof BaseException) {
        throw error;
      }

      throw new BaseException(
        error?.status || 500,
        error?.message || 'Internal server error'
      );
    }
  },

  async searchSets(keyword: string, page: number, limit: number) {
    if (!keyword || keyword.trim() === '') {
      return new BaseSuccessResponse('No sets found matching your search', {
        sets: [],
        pagination: { totalItems: 0, totalPages: 0, currentPage: page, limit },
      });
    }
    const { sets, totalItems } = await SetRepository.findByTitle(
      keyword,
      page,
      limit
    );
    const totalPages = Math.ceil(totalItems / limit);
    const data = {
      sets,
      pagination: { totalItems, totalPages, currentPage: page, limit },
    };
    return new BaseSuccessResponse('Sets retrieved successfully', data);
  },

  async getTrendingSets(page: number, limit: number) {
    try {
      const result = await SetRepository.findTopViewed(page, limit);
      return {
        sets: result.sets,
        pagination: {
          totalItems: result.totalItems,
          totalPages: result.totalPages,
          currentPage: page,
          limit: limit,
        },
      };
    } catch (error: any) {
      throw new BaseException(
        error?.status || 500,
        'Failed to retrieve trending sets'
      );
    }
  },

  async findSharedWithUser(userId: string, currentUserId: string) {
    try {
      if (currentUserId !== userId) {
        throw new BaseException(
          403,
          'You do not have permission to view this data'
        );
      }

      const user = await getUserById(userId);
      if (!user) {
        throw new BaseException(404, 'User not found');
      }

      const sets = await SetRepository.findSharedWithUser(userId);
      return sets;
    } catch (error: any) {
      if (error instanceof BaseException) {
        throw error;
      }
      throw new BaseException(
        error?.status || 500,
        error?.message || 'Internal server error'
      );
    }
  },
};
