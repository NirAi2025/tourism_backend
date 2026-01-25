import { StatusCodes } from "http-status-codes";
import constants from "../../config/constants.js";
import { 
  getAllUserService,
  userDetailsByIdService,
  verifyGuideIdentityService 
} from "../../services/user/user.service.js";
import ApiError from "../../utils/ApiError.js";

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

export const userDetailsById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userDetailsByIdService(id);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: error.message || constants.INTERNAL_SERVER_ERROR,
      });
  }
};
export const verifyGuideIdentity = async (req, res) => {
  try {
    const userId = req.user.id;
    const payload = req.body;
    payload.userId = userId;
    const result = await verifyGuideIdentityService(payload);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: error.message || constants.INTERNAL_SERVER_ERROR,
      });
  }
};
