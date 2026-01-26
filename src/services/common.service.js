import { Op } from "sequelize";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import sequelize from "../config/database.js";
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