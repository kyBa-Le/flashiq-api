import { prisma } from '../../utils/prisma';

type Card = {
  term: string;
  definition: string;
  example?: string;
  image_url?: string;
};

export const findSetById = async (setId: string, tx?: any) => {
  const client = tx || prisma;
  return await client.set.findUnique({
    where: { id: setId },
  });
};

export const createManyCards = async (
  setId: string,
  cards: Card[],
  tx?: any
) => {
  const cardData = cards.map((card) => ({
    ...card,
    setId,
  }));

  const client = tx || prisma;

  return await client.card.createMany({
    data: cardData,
  });
};

export const createCard = async (setId: string, card: Card) => {
  return await prisma.card.create({
    data: {
      ...card,
      setId,
    },
  });
};
