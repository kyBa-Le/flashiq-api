import { BaseSuccessResponse } from '../../dto/SuccessResponse';
import {
  countCartInSet,
  countStudyRecord,
  deleteStudyRecords,
  getCardIdsInSet,
  getCardsWithProgress,
  findStudyRecordScore,
  getStudyRecords,
  insertStudyRecords,
  updateScore,
} from './study_record.repository';
import { BaseException } from '../../errors/BaseException';

export const getStudyRecordspProgress = async (
  userId: string,
  setId: string
) => {
  try {
    const cardCount = await countCartInSet(setId);
    const recordCount = await countStudyRecord(userId, setId);
    if (cardCount !== recordCount) {
      const cards = await getCardIdsInSet(setId);
      const records = await getStudyRecords(userId, setId);
      const cardIds = cards.map((c) => c.id);
      const recordCardIds = records.map((r) => r.cardId);

      const missingCardIds = cardIds.filter(
        (id) => !recordCardIds.includes(id)
      );
      if (missingCardIds.length > 0) {
        await insertStudyRecords(
          missingCardIds.map((cardId) => ({
            userId,
            setId,
            cardId,
          }))
        );
      }
      const extraRecordIds = recordCardIds.filter(
        (recordCardId) => !cardIds.includes(recordCardId)
      );

      if (extraRecordIds.length > 0) {
        await deleteStudyRecords(userId, extraRecordIds);
      }
    }
    const data = await getCardsWithProgress(userId, setId);
    return new BaseSuccessResponse(
      'Study records retrieved successfully',
      data
    );
  } catch (error: any) {
    throw new BaseException(error.status, error.message);
  }
};

export const updateStudyRecordScore = async (
  userId: string,
  cardId: string,
  isCorrect: boolean
) => {
  try {
    const currentScoreRecord = await findStudyRecordScore(userId, cardId);
    if (!currentScoreRecord) {
      throw new BaseException(400, 'Study record does not exist');
    }
    let score = currentScoreRecord.score;
    score += isCorrect ? 0.2 : -0.3;
    score = Math.round(Math.min(1, Math.max(0, score)) * 10) / 10;
    const data = await updateScore(userId, cardId, score);
    return new BaseSuccessResponse('Score updated successfully', data);
  } catch (error: any) {
    throw new BaseException(
      error.status || 500,
      error.message || 'Internal server error'
    );
  }
};
