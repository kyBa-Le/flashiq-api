import { PrismaClient } from '@prisma/client';
import { CreateSetDto } from './sets.dto';

const prisma = new PrismaClient();

export const SetsRepository = {
  async createSet(data: CreateSetDto) {
    try {
      return await prisma.set.create({
        data: {
          title: data.title,
          description: data.description,
          ownerId: data.ownerId,
          isPublic: data.isPublic,
        },
      });
    } catch (error) {
      console.error('Loi khi tao set', error);
      throw new Error('Khong the tao set moi');
    }
  },
  async findById(id: string, inclueCards: boolean) {
    return await prisma.set.findUnique({
      where: { id },
      include: {
        cards: inclueCards,
      },
    });
  },
  async updateSet(id: string, data: CreateSetDto) {
    return await prisma.set.update({
      where: { id },
      data: data,
    });
  },
  async deleteSet(id: string) {
    return await prisma.set.delete({ where: { id } });
  },
};
