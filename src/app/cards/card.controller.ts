import { Request, Response } from 'express';
import {
  createBulkCards,
  createSingleCard,
  removeCardById,
  getCardById,
  getCardList,
  updateSingleCard,
} from './card.service';

export const createBulkCardsController = async (
  req: Request,
  res: Response
) => {
  try {
    const setId = req.params.id;
    const { data } = req.body;
    const result = await createBulkCards(setId, data);
    return res.status(201).json({
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
    return res.status(201).json({
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

export const getSingleCardById = async (req: Request, res: Response) => {
  try {
    const cardId = req.params.id;
    const card = await getCardById(cardId);
    if (!card) {
      return res.status(404).json({
        message: 'Card not found',
      });
    }

    return res.status(200).json({
      message: 'Get card successfully',
      data: card,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Internal server error',
      errors: [error.message],
    });
  }
};

export const getAllCards = async (req: Request, res: Response) => {
  try {
    const setId = req.params.id;
    const cards = await getCardList(setId);
    return res.status(200).json({
      message:
        cards.length === 0 ? 'No cards found' : 'Get card list successfully',
      data: cards,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Internal server error',
      errors: [error.message],
    });
  }
};

export const updateCard = async (req: Request, res: Response) => {
  try {
    const cardId = req.params.id;
    const payload = req.body;

    const updatedCard = await updateSingleCard(cardId, payload);

    return res.status(200).json({
      message: 'Update card successfully',
      data: updatedCard,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Internal server error',
      errors: [error.message],
    });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const cardId = req.params.id;
    await removeCardById(cardId);

    return res.status(200).json({
      message: 'Delete card successfully',
    });
  } catch (error: any) {
    return res.status(error.message === 'Card not found' ? 404 : 500).json({
      message: error.message || 'Internal server error',
      errors: error.message === 'Card not found' ? [] : [error.message],
    });
  }
};
