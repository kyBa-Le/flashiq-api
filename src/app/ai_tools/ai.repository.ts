import { prisma } from '../../utils/prisma';

export const findCardsBySetId = async (setId: string) => {
  return prisma.card.findMany({
    where: {
      setId: setId,
    },
  });
};
