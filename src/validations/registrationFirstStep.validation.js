import Joi from "joi";

export const registrationSchema = Joi.object({
  firstName: Joi.string().trim().required().messages({
    "any.required": "First name is required",
    "string.empty": "First name cannot be empty",
  }),

  lastName: Joi.string().trim().required().messages({
    "any.required": "Last name is required",
    "string.empty": "Last name cannot be empty",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),

  country_code: Joi.string().required().messages({
    "any.required": "Country code is required",
  }),

  phone: Joi.string().required().messages({
    "any.required": "Phone number is required",
  }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),


  whatsAppNumber: Joi.string().optional().allow(null, "").messages({
    "string.base": "WhatsApp number must be a string",
  }),

  languageId: Joi.number().integer().required().messages({
    "any.required": "Language ID is required",
    "number.base": "Language ID must be a number",
    "number.integer": "Language ID must be an integer",
  }),

  dob: Joi.date().required().messages({
    "any.required": "Date of birth is required",
    "date.base": "Date of birth must be a valid date",
  }),

  nationality: Joi.number().integer().required().messages({
    "any.required": "Nationality is required",
    "number.base": "Nationality must be a number",
  }),

  countryOfOperation: Joi.number().integer().required().messages({
    "any.required": "Country of operation is required",
    "number.base": "Country of operation must be a number",
  }),

  primaryCity: Joi.number().integer().required().messages({
    "any.required": "Primary city is required",
    "number.base": "Primary city must be a number",
  }),

  yearsOfExperience: Joi.number().integer().min(0).optional().messages({
    "number.base": "Years of experience must be a number",
    "number.min": "Years of experience cannot be negative",
  }),
});
