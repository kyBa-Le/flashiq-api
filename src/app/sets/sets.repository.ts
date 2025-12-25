import { PrismaClient } from '@prisma/client';
import { CreateSetDto } from './sets.dto';

const prisma = new PrismaClient();

export const SetRepository = {
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
      console.error('Error creating set', error);
      throw new Error('Unable to create a new set');
    }
  },

  async findByUserId(userId: string) {
    try {
      return await prisma.set.findMany({
        where: {
          ownerId: userId,
        },
      });
    } catch (error) {
      console.error('Error retrieving sets by userId', error);
      throw new Error('Unable to retrieve the list of sets');
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
