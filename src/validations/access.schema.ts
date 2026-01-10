import Joi from 'joi';

export const shareSetSchema = Joi.object({
  setId: Joi.string().required().messages({
    'any.required': 'setId is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  permission: Joi.string().valid('VIEW', 'EDIT').required(),
});
