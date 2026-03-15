import { StatusCodes } from "http-status-codes";
import { 
  tourDetailsService,
  tourAvailabilityAndPriceService,
  toursBySelectedCityService,
  topRatedGuidesService 
} from "../../services/user/tour.service.js";
import {
  userDetailsByIdService
} from "../../services/user/user.service.js";

export const tourAvailability = async (req, res) => {
  const { tour_id } = req.params;
  const { month, year } = req.query;

  try {
    const result = await tourAvailabilityAndPriceService({
      tour_id,
      month,
      year,
    });

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

export const toursBySelectedCity = async (req, res) => {
  const { city_id } = req.query;

  try {
    const result = await toursBySelectedCityService(city_id);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Tours fetched successfully",
      data: result,
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

export const tourDetails = async (req, res) => {
  const { tour_id } = req.params;

  try {
    const result = await tourDetailsService(tour_id);

    return res.status(StatusCodes.OK).json({
      success: true,
      ...result,
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

export const topRatedGuides = async (req, res) => {
  const { city_id } = req.query;

  try {
    const result = await topRatedGuidesService(city_id);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Guides fetched successfully",
      data: result,
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
 export const guideDetails = async (req, res) => {
  const { guide_id } = req.params;

  try {
    const result = await userDetailsByIdService(guide_id);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Guide details fetched successfully",
      data: result,
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

