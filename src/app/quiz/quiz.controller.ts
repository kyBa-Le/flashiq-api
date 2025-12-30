import { Request, Response } from 'express';
import { Quiz } from './quiz.type';
import {
  getMultipleChoiceQuestions,
  getTrueFalseQuestions,
  getFillBlankQuestions,
} from './quiz.service';
import { BaseSuccessResponse } from '../../dto/SuccessResponse';
import { BaseException } from '../../errors/BaseException';

export const getQuiz = async (req: Request, res: Response) => {
  const { mode } = req.query;
  if (!mode) {
    throw new BaseException(400, 'mode is required');
  }
  const setId = req.params.id;
  let result: Quiz[] = [];

  switch (mode) {
    case 'multiple_choice':
      result = await getMultipleChoiceQuestions(setId);
      break;
    case 'true_false':
      result = await getTrueFalseQuestions(setId);
      break;
    case 'fill_blank':
      result = await getFillBlankQuestions(setId);
      break;
    default:
      throw new BaseException(400, 'Invalid mode');
  }

  const response = new BaseSuccessResponse('Get quizzes successfully', result);
  return res.json(response);
};
