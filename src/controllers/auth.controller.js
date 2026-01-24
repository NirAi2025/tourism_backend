import { StatusCodes } from "http-status-codes";
import constants from "../config/constants.js";
import {
  loginService,
  registrationService,
} from "../services/auth.service.js";
export const login = async (req, res) => {
  try {
    const data = await loginService(req.body);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

export const register = async (req, res) => {
  try {
    const result = await registrationService(req.body);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message:
        result?.message || "Registration successful",
      data: result || null,
    });
  } catch (error) {
    const statusCode = error.statusCode || StatusCodes.BAD_REQUEST;

    if (statusCode == StatusCodes.CONFLICT) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(statusCode).json({
      success: false,
      message: error.message || constants.INTERNAL_SERVER_ERROR,
    });
  }
};

