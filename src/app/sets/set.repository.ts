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
          include: {
            _count: {
              select: {
                cards: true,
              },
            },
          },
        }),
        prisma.set.count({ where: { ownerId: userId } }),
      ]);
      const setsWithCardCount = sets.map((set) => ({
        ...set,
        cardCount: set._count.cards,
        _count: undefined,
      }));

      return {
        sets: setsWithCardCount,
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

  async findById(id: string, includeCards: boolean) {
    return await prisma.set.findUnique({
      where: { id },
      include: {
        cards: includeCards,
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

  async incrementViewCount(id: string) {
    return await prisma.set.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
      },
    });
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
    const whereCondition = {
      title: { contains: keyword, mode: 'insensitive' as const },
    };

    const [sets, totalItems] = await Promise.all([
      prisma.set.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.set.count({ where: whereCondition }),
    ]);
    return { sets, totalItems };
  },

  async findTopViewed(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [totalItems, sets] = await prisma.$transaction([
      prisma.set.count(),
      prisma.set.findMany({
        orderBy: { viewCount: 'desc' },
        skip: skip,
        take: limit,
        include: {
          _count: {
            select: { cards: true },
          },
        },
      }),
    ]);
    return {
      sets,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    };
  },

  async findSharedWithUser(userId: string) {
    try {
      const sets = await prisma.set.findMany({
        where: {
          Access: {
            some: {
              userId: userId,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        include: {
          User: {
            select: {
              username: true,
            },
          },
          _count: {
            select: { cards: true },
          },
        },
      });

      const mapped = sets.map((s: any) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        ownerId: s.ownerId,
        ownerName: s.User?.username || '',
        isPublic: s.isPublic,
        viewCount: s.viewCount,
        cloneCount: s.cloneCount,
        cardCount: s._count?.cards || 0,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      }));

      return mapped;
    } catch {
      console.error('Error retrieving shared sets');
      const err: any = new Error('Unable to retrieve shared sets');
      err.status = 500;
      throw err;
    }
  },
};
