import { StatusCodes } from 'http-status-codes';

export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // show all errors
      stripUnknown: true, // remove extra fields
    });

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(err => err.message),
      });
    }

    // replace body with validated data
    req.body = value;
    next();
  };
};
