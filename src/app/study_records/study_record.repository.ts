import { prisma } from '../../utils/prisma';

export const countCartInSet = async (setId: string) => {
  return await prisma.card.count({
    where: {
      setId: setId,
    },
  });
};

export const countStudyRecord = async (userId: string, setId: string) => {
  return await prisma.studyRecord.count({
    where: {
      userId: userId,
      setId: setId,
    },
  });
};

export const getCardIdsInSet = async (setId: string) => {
  return await prisma.card.findMany({
    where: {
      setId: setId,
    },
    select: {
      id: true,
    },
  });
};

export const getStudyRecords = async (userId: string, setId: string) => {
  return await prisma.studyRecord.findMany({
    where: {
      userId: userId,
      setId: setId,
    },
    select: {
      cardId: true,
    },
  });
};

export const deleteStudyRecords = async (userId: string, cardIds: string[]) => {
  return await prisma.studyRecord.deleteMany({
    where: {
      userId: userId,
      cardId: { in: cardIds },
    },
  });
};

export const insertStudyRecords = async (
  records: { userId: string; setId: string; cardId: string }[]
) => {
  return prisma.studyRecord.createMany({
    data: records,
    skipDuplicates: true,
  });
};

export const getCardsWithProgress = async (userId: string, setId: string) => {
  return prisma.card.findMany({
    where: { setId: setId },
    include: {
      studyRecords: {
        where: { userId: userId },
        select: {
          score: true,
          last_reviewed: true,
        },
      },
    },
  });
};

export const updateScore = async (
  userId: string,
  cardId: string,
  score: number
) => {
  return prisma.studyRecord.update({
    where: {
      userId_cardId: {
        userId: userId,
        cardId: cardId,
      },
    },
    data: {
      score: score,
      last_reviewed: new Date(),
    },
  });
};

export const findStudyRecordScore = async (userId: string, cardId: string) => {
  return prisma.studyRecord.findUnique({
    where: {
      userId_cardId: {
        userId: userId,
        cardId: cardId,
      },
    },
    select: {
      score: true,
    },
  });
};
