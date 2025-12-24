import { CreateSetDto } from './sets.dto';
import { SetsRepository } from './sets.repository';

export const SetsService = {
  async createSet(data: CreateSetDto) {
    return await SetsRepository.createSet(data);
  },
  async findById(id: string, inclueCards: boolean = false) {
    return await SetsRepository.findById(id, inclueCards);
  },
  async updateSet(id: string, data: CreateSetDto) {
    return await SetsRepository.updateSet(id, data);
  },
  async deleteSet(id: string) {
    return await SetsRepository.deleteSet(id);
  },
};
