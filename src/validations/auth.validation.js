import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required',
    }),

  type: Joi.number()
    .valid(1, 2)  // 1 for admin, 2 for user
    .required()
    .messages({
      'any.only': 'Invalid login type',
      'any.required': 'Login type is required',
    }),
});
