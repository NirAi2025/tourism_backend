import Joi from "joi";

export const registrationSecondStepSchema = Joi.object({
    firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),

  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),

  dob: Joi.date()
    .less("now")
    .required()
    .messages({
      "date.less": "Date of birth must be in the past",
    }),

  nationality: Joi.string()
    .trim()
    .required(),

  countryOfOperation: Joi.number()
    .integer()
    .positive()
    .required(),

  primaryCity: Joi.number()
    .integer()
    .positive()
    .required(),

  yearsOfExperience: Joi.number()
    .integer()
    .min(0)
    .max(60)
    .optional()
    .allow(null),

  email: Joi.string()
    .email()
    .optional(),

  country_code: Joi.string()
    .optional(),

  phone: Joi.string()
    .pattern(/^[0-9]{7,15}$/)
    .optional(),
});