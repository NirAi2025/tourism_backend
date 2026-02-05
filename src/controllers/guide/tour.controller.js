import { StatusCodes } from "http-status-codes";
import constants from "../../config/constants.js"
import { 
  tourCategoriesService,
  createTourStepOneService, 
  createTourStepTwoService,
  createTourStepThreeService,
  createTourStepFourService,
  createTourStepFiveService,
  createTourStepSixService
} from "../../services/tour.service.js";
import ApiError from "../../utils/ApiError.js";

export const tourCategories = async (req, res) => {
  try {
    const { category_id = null, search = null } = req.query;

    const payload = {
      category_id: category_id ? Number(category_id) : null,
      search
    };

    const result = await tourCategoriesService(payload);

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: error.message || "Something went wrong",
      });
  }
};

export const createTourStepOne = async (req, res) => {
  try {
    const userId = req.user.id;
    req.body.guide_id = userId;
    const result = await createTourStepOneService(req.body);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: result.message,
      data: result.data,
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

export const createTourStepTwo = async (req, res) => {
  try {
    console.log("hereeee");
    
    const userId = req.user.id;
    console.log(userId);
    
    const result = await createTourStepTwoService(req.body);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: result.message,
      data: result.data,
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
export const createTourStepThree = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await createTourStepThreeService(req.body);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: result.message,
      data: result.data,
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

export const createTourStepFour = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await createTourStepFourService(req.body);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: result.message,
      data: result.data,
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

export const createTourStepFive = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await createTourStepFiveService(req.body);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: result.message,
      data: result.data,
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
export const createTourStepSix = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await createTourStepSixService(req.body);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: result.message,
      data: result.data,
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
