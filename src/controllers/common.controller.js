import { StatusCodes } from "http-status-codes";
import constants from "../config/constants.js";
import {
    countryCurrencyService,
    getAllCountriesService,
    getStatesByCountryService,
    getCitiesByStateService
} from "../services/common.service.js";

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