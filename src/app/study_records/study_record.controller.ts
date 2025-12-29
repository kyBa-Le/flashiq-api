import { Request, Response } from 'express';
import {
  getStudyRecordspProgress,
  updateStudyRecordScore,
} from './study_record.service';

export const getStudyRecords = async (req: Request, res: Response) => {
  const { id: setId } = req.params;
  const userId = (req as any).user?.id;

  const result = await getStudyRecordspProgress(userId, setId);

  return res.status(200).json(result);
};

export const submitCardAnswer = async (req: Request, res: Response) => {
  const { cardId, isCorrect } = req.body;
  const userId = (req as any).user?.id;

  const result = await updateStudyRecordScore(userId, cardId, isCorrect);

  return res.status(200).json(result);
};
