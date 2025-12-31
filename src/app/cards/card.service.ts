import {
  findSetById,
  createManyCards,
  createCard,
  findCardById,
  findCardsBySetId,
  updateCardById,
  deleteCardById,
} from './card.repository';
import { prisma } from '../../utils/prisma';
import { CardDto } from './card.dto';
import { Card } from '@prisma/client';

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

export const getCardBySetId = async (setId: string) => {
  if (!setId) {
    throw new Error('Set id is required');
  }
  return await findCardsBySetId(setId);
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

export const bulkUpdateCardsBySetId = async (
  setId: string,
  oldCards: Card[],
  newCards: CardDto[]
) => {
  return await prisma.$transaction(async (tx) => {
    const existingCards = await getCardBySetId(setId);

    const existingIds = existingCards.map((card) => card.id);
    const updatingIds = oldCards.map((card) => card.id);
    const idsToDelete = existingIds.filter(
      (id: string) => !updatingIds.includes(id)
    );

    await Promise.all(idsToDelete.map((id) => deleteCardById(id, tx)));
    await Promise.all(
      oldCards.map((card) => updateCardById(card.id, card, tx))
    );
    await createManyCards(setId, newCards, tx);
  });
};
