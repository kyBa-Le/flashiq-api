import { Request, Response } from 'express';
import { generateText } from './ai.service';

export const generateStory = async (req: Request, res: Response) => {
  const setId = req.params.id;

  const result = await generateText(setId);

  return res.status(200).json(result);
};
