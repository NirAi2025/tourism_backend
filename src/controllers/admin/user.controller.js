import { StatusCodes } from "http-status-codes";
import constants from "../../config/constants.js";
import { getAllUserService } from "../../services/user/user.service.js";

export const users = async (req, res) => {
  try {
    const {
      type,  // 1: user, 2: guide
      page = 1,
      limit = 10,
      ...filters
    } = req.query;

    const result = await getAllUserService({
      type: Number(type),     
      page: Number(page),    
      limit: Number(limit),  
      ...filters,
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
