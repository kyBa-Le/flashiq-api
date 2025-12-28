import { Request, Response } from 'express';
import {
  getStudyRecordspProgress,
  updateStudyRecordScore,
} from './study_record.service';
import { BaseErrorResponse } from '../../dto/ErrorResponse';

export const getStudyRecords = async (req: Request, res: Response) => {
  const { id: setId } = req.params;
  const userId = (req as any).user?.id;

  const result = await getStudyRecordspProgress(userId, setId);

  if (result instanceof BaseErrorResponse) {
    return res.status(400).json(result);
  }

  return res.status(200).json(result);
};

export const submitCardAnswer = async (req: Request, res: Response) => {
  const { cardId, isCorrect } = req.body;
  const userId = (req as any).user?.id;

  const result = await updateStudyRecordScore(userId, cardId, isCorrect);

  if (result instanceof BaseErrorResponse) {
    return res.status(400).json(result);
  }

  return res.status(200).json(result);
};
