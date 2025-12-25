import Joi from 'joi';

export const createSetSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'any.required': 'The title must not be blank',
  }),

  description: Joi.string().allow('', null),

  isPublic: Joi.boolean().default(false).messages({
    'boolean.base': 'isPublic must be of type true/false',
  }),
});
