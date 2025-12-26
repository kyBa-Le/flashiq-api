import { CreateSetDto } from './set.dto';
import { SetRepository } from './set.repository';

export const SetService = {
  async createSet(data: CreateSetDto) {
    return await SetRepository.createSet(data);
  },
  async findByUserId(userId: string, page: number, limit: number) {
    return await SetRepository.findByUserId(userId, page, limit);
  },
  async findById(id: string, inclueCards: boolean = false) {
    return await SetRepository.findById(id, inclueCards);
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
};
