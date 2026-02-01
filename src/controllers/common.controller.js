import { StatusCodes } from "http-status-codes";
import constants from "../config/constants.js";
import {
    countryCurrencyService,
    getAllCountriesService,
    getStatesByCountryService,
    getCitiesByStateService,
    languagesService
} from "../services/common.service.js";
import { tourCategoriesService } from "../services/tour.service.js";

export const getCountryCurrency = async (req, res) => {
  try {
    const data = await countryCurrencyService();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Country currency fetched successfully",
      data,
    });
  } catch (error) {
    const statusCode = error.statusCode || StatusCodes.BAD_REQUEST;

    return res.status(statusCode).json({
      success: false,
      message: error.message || constants.INTERNAL_SERVER_ERROR,
    });
  }
};

export const getAllCountries = async (req, res) => {
  try {
    const data = await getAllCountriesService();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Countries fetched successfully",
      data,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || constants.INTERNAL_SERVER_ERROR,
    });
  }
};

export const getStatesByCountry = async (req, res) => {
  try {
    const { countryId } = req.params;
    const data = await getStatesByCountryService(countryId);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "States fetched successfully",
      data,
    });
  } catch (error) {
    const statusCode = error.statusCode || StatusCodes.BAD_REQUEST;

    return res.status(statusCode).json({
      success: false,
      message: error.message || constants.INTERNAL_SERVER_ERROR,
    });
  }
};

export const getCitiesByState = async (req, res) => {
  try {
    const { stateId } = req.params;
    const data = await getCitiesByStateService(stateId);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Cities fetched successfully",
      data,
    });
  } catch (error) {
    const statusCode = error.statusCode || StatusCodes.BAD_REQUEST;

    return res.status(statusCode).json({
      success: false,
      message: error.message || constants.INTERNAL_SERVER_ERROR,
    });
  }
};
export const languages = async (req, res) => {
  try {
    const data = await languagesService();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Languages fetched successfully",
      data,
    });
  } catch (error) {
    const statusCode = error.statusCode || StatusCodes.BAD_REQUEST;

    return res.status(statusCode).json({
      success: false,
      message: error.message || constants.INTERNAL_SERVER_ERROR,
    });
  }
}

export const tourCategories = async (req, res) => {
  try {
    const { category_id = null, filter = null} = req.query;

    const payload = {
      category_id: category_id ? Number(category_id) : null,
      filter
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