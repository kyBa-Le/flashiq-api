import { Request, Response } from 'express';
import { createBulkCards, createSingleCard } from './card.service';

export const createBulkCardsController = async (
  req: Request,
  res: Response
) => {
  try {
    const setId = req.params.id;
    const { data } = req.body;
    const result = await createBulkCards(setId, data);
    return res.status(200).json({
      message: 'Cards inserted successfully',
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Some errors occur while processing request',
      errors: [error.message],
    });
  }
};

export const createCardController = async (req: Request, res: Response) => {
  try {
    const setId = req.params.id;
    const data = req.body;
    const result = await createSingleCard(setId, data);
    return res.status(200).json({
      message: 'Card inserted successfully',
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Some errors occur while processing request',
      errors: [error.message],
    });
  }
};
