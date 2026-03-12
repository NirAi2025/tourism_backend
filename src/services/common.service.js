import { Op } from "sequelize";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { getCoordinates } from "../utils/geocodeCity.js";
import { withFileUrl } from "../config/fileUploadPath.js";
import {
    City,
    Country,
    State,
    Language
} from "../models/index.js";

export const countryCurrencyService = async () => {
  const currencies = await Country.findAll({
    attributes: ['name', 'currency'],
    raw: true,
  });

  if (!currencies) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "No country found");
  }

  return currencies;
};
export const getAllCountriesService = async () => {
  const countries = await Country.findAll({
    attributes: ['id', 'name', 'currency', 'phone_code'],
    raw: true,
  });

  return countries;
}
export const getStatesByCountryService = async (countryId) => {
  const states = await State.findAll({
    where: { country_id: countryId },
    attributes: ['id', 'name'],
    raw: true,
  });

  if (!states) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "No states found");
  }
    return states;
};
export const getCitiesByStateService = async (stateId) => {
  const cities = await City.findAll({
    where: { state_id: stateId },
    attributes: ['id', 'name'],
    raw: true,
  });
  
  if (!cities) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "No cities found");
  }

  return cities;
};
export const languagesService = async () => {
  const languages = await Language.findAll({
    attributes: ['id', 'name', 'code'],
    raw: true,
  });

  if (!languages) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "No languages found");
  }

  return languages;
}
export const getCitiesByCountryService = async ({
  countryId,
  page = 1,
  limit = 10,
}) => {
  const pageNumber = Math.max(parseInt(page, 10), 1);
  const pageSize = Math.min(parseInt(limit, 10), 50); // max 50 per page
  const offset = (pageNumber - 1) * pageSize;

  const { rows, count } = await City.findAndCountAll({
    where: { country_id: countryId },
    include: [
      {
        model: State,
        attributes: ['id', 'name', 'slug'],
      },
      {
        model: Country,
        attributes: ['id', 'name', 'slug', 'emoji'],
      },
    ],
    attributes: ['id', 'name', 'slug', 'status', 'is_iconic', 'iconic_image'],
    limit: pageSize,
    offset,
    distinct: true,
    order: [['name', 'ASC']],
  });
  const updatedRows = rows.map((city) => {
    const cityJson = city.toJSON();

    if (cityJson.iconic_image) {
      cityJson.iconic_image = withFileUrl(
        cityJson.iconic_image,
        "iconic-city"
      );
    }

    return cityJson;
  });
  return {
    data: updatedRows,
    pagination: {
      totalRecords: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: pageNumber,
      pageSize,
    },
  };
};
export const changeCityIconicStatusService = async (cityId) => {
  const city = await City.findByPk(cityId);

  if (!city) {
    throw new ApiError(StatusCodes.NOT_FOUND, "City not found");
  }

  const isUpdated = await city.update({
    is_iconic: !city.is_iconic,
  });

  return isUpdated;
};
export const updateCityIconicImageService = async (cityId, image) => {
  const city = await City.findByPk(cityId); 

  if (!city) {
    throw new ApiError(StatusCodes.NOT_FOUND, "City not found");
  }
  const updateIconicImage = await city.update({
    iconic_image: image,
  });

  return updateIconicImage;
}
export const addCityService = async (payload = {}) => {
  try {
    const { name, country_id } = payload;

    if (!name) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "City name is required");
    }
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const existingCity = await City.findOne({
      where: { slug },
    });

    if (existingCity) {
      throw new ApiError(StatusCodes.CONFLICT, "City already exists");
    }
    // Get coordinates
    const geoRes = await getCoordinates(name);

    let latitude = null;
    let longitude = null;
    let placeId = null;
    if (geoRes) {
      placeId = geoRes?.placeId;
      latitude = geoRes?.latitude;
      longitude = geoRes?.longitude;
    }
    if(!placeId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid city name");
    }
    // Create city
    const city = await City.create({
      name,
      place_Id: placeId,
      country_id,
      latitude,
      longitude,
    });

    return {
      success: true,
      message: "City added successfully",
      data: city.data,
    };
  } catch (error) {
    console.error("Add City Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};
export const iconicDestinationsService = async () => {
  const iconicCities = await City.findAll({
    where: {
      is_iconic: true,
    },
    attributes: ['id', 'name', 'slug', 'iconic_image'],
    include: [
      {
        model: State,
        attributes: ['id', 'name', 'slug'],
      },
      {
        model: Country,
        attributes: ['id', 'name', 'slug', 'emoji'],
      },
    ],
  });

  const updatedCities = iconicCities.map((city) => {
    const cityJson = city.toJSON();

    if (cityJson.iconic_image) {
      cityJson.iconic_image = withFileUrl(cityJson.iconic_image, "iconic-city");
    }

    return cityJson;
  });

  return updatedCities;
};

