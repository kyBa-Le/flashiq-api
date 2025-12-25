import {
  findSetById,
  createManyCards,
  createCard,
  findCardById,
  findAllCards,
  updateCardById,
  deleteCardById,
} from './card.repository';
import { prisma } from '../../utils/prisma';
import { CardDto } from './card.dto';

export const createBulkCards = async (setId: string, cards: CardDto[]) => {
  return await prisma.$transaction(async (tx) => {
    const set = await findSetById(setId, tx);

    if (!set) {
      throw new Error('Set not found');
    }

    return await createManyCards(setId, cards, tx);
  });
};

export const createSingleCard = async (setId: string, card: CardDto) => {
  const set = await findSetById(setId);

  if (!set) {
    throw new Error('Set not found');
  }
  return await createCard(setId, card);
};

export const getCardById = async (cardId: string) => {
  if (!cardId) {
    throw new Error('Card id is required');
  }
  return await findCardById(cardId);
};

export const getCardList = async (setId: string) => {
  if (!setId) {
    throw new Error('Set id is required');
  }
  return await findAllCards(setId);
};

export const updateSingleCard = async (cardId: string, payload: CardDto) => {
  const existingCard = await findCardById(cardId);

  if (!existingCard) {
    throw new Error('Card not found');
  }

  return updateCardById(cardId, payload);
};

export const removeCardById = async (cardId: string) => {
  const existingCard = await findCardById(cardId);

  if (!existingCard) {
    throw new Error('Card not found');
  }
  return await deleteCardById(cardId);
};
