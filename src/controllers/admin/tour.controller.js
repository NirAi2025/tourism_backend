import { StatusCodes } from "http-status-codes";
import constants from "../../config/constants.js";
import {
    tourProductsService,
    tourProductDetailsService
} from "../../services/tour.service.js";
import ApiError from "../../utils/ApiError.js";

export const allTours = async (req, res) => {
  try {
    const { guide_id, page, limit } = req.query;
    const result = await tourProductsService({
      guide_id,
      page,
      limit,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    const statusCode =
      error.message == "Invalid user type"
        ? StatusCodes.BAD_REQUEST
        : StatusCodes.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
      success: false,
      message: error.message || constants.INTERNAL_SERVER_ERROR,
    });
  }
};
export const tourDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await tourProductDetailsService(id);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: result.message,
      data: result.data || null,
    });
  } catch (error) {
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: error.message || "Something went wrong",
      });
  }
};


