import { CreateSetDto } from './sets.dto';
import { SetRepository } from './sets.repository';

export const SetService = {
  async createSet(data: CreateSetDto) {
    return await SetRepository.createSet(data);
  },
  async findByUserId(id: string) {
    return await SetRepository.findByUserId(id);
  },
  async findById(id: string, inclueCards: boolean = false) {
    return await SetRepository.findById(id, inclueCards);
  },
  async updateSet(id: string, data: CreateSetDto) {
    return await SetRepository.updateSet(id, data);
  },
  async deleteSet(id: string) {
    return await SetRepository.deleteSet(id);
  },
};
