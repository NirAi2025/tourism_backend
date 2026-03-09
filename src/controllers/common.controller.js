import { StatusCodes } from "http-status-codes";
import constants from "../config/constants.js";
import {
    countryCurrencyService,
    getAllCountriesService,
    getStatesByCountryService,
    getCitiesByStateService,
    getCitiesByCountryService,
    changeCityIconicStatusService,
    updateCityIconicImageService,
    addCityService,
    languagesService,
    iconicDestinationsService
} from "../services/common.service.js";
import { tourCategoriesService } from "../services/tour.service.js";
import { ICONIC_CITY_IMG_UPLOAD_PATH } from "../config/fileUploadPath.js";
import { fileUploaderSingle } from "../utils/fileUpload.js";

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
export const getCitiesByCountry = async (req, res) => {
  try {
    const { countryId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!countryId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Country ID is required",
      });
    }

    const data = await getCitiesByCountryService({
      countryId,
      page,
      limit,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Cities fetched successfully",
      data: data?.data,
      pagination: data?.pagination
    });

  } catch (error) {
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
      success: false,
      message: error.message || constants.INTERNAL_SERVER_ERROR,
    });
  }
};

export const changeCityIconicStatus = async (req, res) => {
  try {
    const { cityId } = req.params;
    const city = await changeCityIconicStatusService(cityId);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "City iconic status changed successfully",
    });
  } catch (error) {
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
      success: false,
      message: error.message || constants.INTERNAL_SERVER_ERROR,
    });
  }
}
export const updateCityIconicImage = async (req, res) => {
  try {
    const { cityId } = req.params;
    const file = req.files?.image;

    if (!file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Iconic image file is required",
      });
    }

    const iconicImage = await fileUploaderSingle(
      ICONIC_CITY_IMG_UPLOAD_PATH,
      file
    );

    const image = iconicImage.newfileName;

    await updateCityIconicImageService(cityId, image);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "City iconic image updated successfully",
    });
  } catch (error) {
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
      success: false,
      message: error.message || constants.INTERNAL_SERVER_ERROR,
    });
  }
}
export const addCity = async (req, res) => {
  try {
    const payload = req.body;

    const result = await addCityService(payload);

    return res.status(StatusCodes.CREATED).json({
      success: result.success,
      message: result.message,
      data: result.data || null,
    });

  } catch (error) {
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
      success: false,
      message: error.message || constants.INTERNAL_SERVER_ERROR,
    });
  }
};
export const iconicDestinationsWorldwide = async (req, res) => {
  try {
    const data = await iconicDestinationsService();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Iconic destinations fetched successfully",
      data,
    });
  } catch (error) {
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
      success: false,
      message: error.message || constants.INTERNAL_SERVER_ERROR,
    });
  }
}


