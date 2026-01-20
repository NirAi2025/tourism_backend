import Joi from 'joi';

export const registrationFirstStepSchema = Joi.object({
    firstName: Joi.string()
        .required()
        .messages({
            'any.required': 'First name is required',
        }),
    lastName: Joi.string()
        .required()
        .messages({
            'any.required': 'Last name is required',
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required',
        }),
    country_code: Joi.string()
        .required()
        .messages({
            'any.required': 'Country code is required', 
        }),
    phone: Joi.string()
        .required()
        .messages({
            'any.required': 'Phone number is required',
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required',
        }),
});