import { CreateSetDto } from './set.dto';
import { prisma } from '../../utils/prisma';

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
      const err = new Error('Unable to retrieve the list of sets') as Error & {
        status?: number;
      };
      err.status = 500;
      throw err;
    }
  },

  async findById(id: string, includeCards: boolean) {
    return await prisma.set.findUnique({
      where: { id },
      include: {
        cards: includeCards,
      },
    });
  },

  async incrementViewCount(id: string) {
    return await prisma.set.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
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

  async findByTitle(keyword: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [sets, totalItems] = await Promise.all([
      prisma.set.findMany({
        where: {
          title: { contains: keyword, mode: 'insensitive' },
        },
        skip: skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.set.count({
        where: {
          title: { contains: keyword, mode: 'insensitive' },
        },
      }),
    ]);

    return { sets, totalItems };
  },

  async findTopViewed(limit: number) {
    return await prisma.set.findMany({
      orderBy: {
        viewCount: 'desc',
      },
      take: limit,
      include: {
        _count: {
          select: { cards: true },
        },
      },
    });
  },
};
