import { Card, Prisma } from '@prisma/client';
import { prisma } from '../../utils/prisma';
import { CardDto } from './card.dto';

export const findSetById = async (setId: string, tx?: any) => {
  const client = tx || prisma;
  return await client.set.findUnique({
    where: { id: setId },
  });
};

export const createManyCards = async (
  setId: string,
  cards: CardDto[],
  tx?: Prisma.TransactionClient
) => {
  const cardData = cards.map((card) => ({
    ...card,
    setId,
  }));

  const client = tx ?? prisma;

  return await client.card.createMany({
    data: cardData,
  });
};

export const createCard = async (setId: string, card: CardDto) => {
  return await prisma.card.create({
    data: {
      ...card,
      setId,
    },
  });
};

export const findCardById = async (cardId: string) => {
  return await prisma.card.findUnique({
    where: { id: cardId },
  });
};

export const findCardsBySetId = async (setId: string) => {
  return await prisma.card.findMany({
    where: { setId },
  });
};

export const updateCardById = async (
  cardId: string,
  data: Partial<CardDto> | Card,
  tx?: Prisma.TransactionClient
) => {
  const client = tx ?? prisma;
  return client.card.update({
    where: { id: cardId },
    data,
  });
};

export const deleteCardById = async (
  cardId: string,
  tx?: Prisma.TransactionClient
) => {
  const client = tx ?? prisma;
  return client.card.delete({
    where: { id: cardId },
  });
};
