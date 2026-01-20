import Joi from "joi";

export const registrationThirdStepSchema = Joi.object({
  id_number: Joi.string()
    .min(5)
    .max(50)
    .required()
    .messages({
      "any.required": "ID number is required",
      "string.min": "ID number must be at least 5 characters",
      "string.max": "ID number must be at most 50 characters",
    }),

  // government id document
  government_id: Joi.any()
    .required()
    .messages({
      "any.required": "Government ID document is required",
    }),

  // selfie with id
  selfie: Joi.any()
    .required()
    .messages({
      "any.required": "Selfie with ID is required",
    }),

  // optional address proof
  address_proof: Joi.any()
    .optional(),
});
