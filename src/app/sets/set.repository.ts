import { PrismaClient } from '@prisma/client';
import { CreateSetDto } from './set.dto';

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
    } catch {
      console.error('Error creating set');
      throw new Error('Unable to create a new set');
    }
  },

  async findByUserId(userId: string, page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;

      const [sets, totalItems] = await Promise.all([
        prisma.set.findMany({
          where: { ownerId: userId },
          skip: skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.set.count({ where: { ownerId: userId } }),
      ]);

      return {
        sets,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      };
    } catch {
      console.error('Error retrieving sets by userId');
      const err: any = new Error('Unable to retrieve the list of sets');
      err.status = 500;
      throw err;
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

  async updateSet(id: string, data: Partial<CreateSetDto>) {
    try {
      return await prisma.set.update({
        where: { id },
        data: data,
      });
    } catch {
      const err = new Error('Database update failed');
      (err as { status?: number }).status = 500;
      throw err;
    }
  },

  async deleteSet(id: string) {
    try {
      return await prisma.set.delete({ where: { id } });
    } catch {
      const err = new Error('Database delete failed');
      (err as { status?: number }).status = 500;
      throw err;
    }
  },
};
