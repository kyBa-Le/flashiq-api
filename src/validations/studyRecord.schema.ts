import Joi from 'joi';
export const submitAnswerSchema = Joi.object({
  cardId: Joi.string().required(),
  isCorrect: Joi.boolean().required(),
});
