import { findSetById, createManyCards, createCard } from './card.repository';
import { prisma } from '../../utils/prisma';

type Card = {
  term: string;
  definition: string;
  example?: string;
  image_url?: string;
};

export const createBulkCards = async (setId: string, cards: Card[]) => {
  return await prisma.$transaction(async (tx) => {
    const set = await findSetById(setId, tx);

    if (!set) {
      throw new Error('Set not found');
    }

    return await createManyCards(setId, cards, tx);
  });
};

export const createSingleCard = async (setId: string, card: Card) => {
  const set = await findSetById(setId);

  if (!set) {
    throw new Error('Set not found');
  }
  return await createCard(setId, card);
};
