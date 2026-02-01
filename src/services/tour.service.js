import { Op } from "sequelize";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { TourCategory } from "../models/index.js";
import sequelize from "../config/database.js";
import { 
  Tour,
  TourTag,
  TourTagMap
} from "../models/index.js";

export const tourCategoriesService = async (payload = {}) => {
  const { category_id, filter } = payload;

  const whereCondition = {};

  if (category_id) {
    whereCondition.parent_id = category_id;
  }

  // Search filter
  if (filter) {
    whereCondition[Op.or] = [
      { name: { [Op.like]: `%${filter}%` } },
      { slug: { [Op.like]: `%${filter}%` } },
    ];
  }

  const categories = await TourCategory.findAll({
    attributes: {
      exclude: [
        "created_at",
        "updated_at",
        "deleted_at",
        "createdAt",
        "updatedAt",
        "deletedAt",
      ],
    },
    where: whereCondition,
    order: [["name", "ASC"]],
  });

  if (category_id && categories.length == 0) {
    const exists = await TourCategory.count({
      where: { id: category_id },
    });

    if (!exists) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
    }
  }

  return {
    success: true,
    message: "Tour categories fetched successfully",
    data: categories,
  };
};

// tour creation step 1
export const createTourStepOneService = async (payload = {}) => {
  const {
    title,
    subtitle,
    tour_category_id,
    country_id,
    state_id,
    city_id,
    guide_id,
    tags = [],
    place,
  } = payload;

  const transaction = await sequelize.transaction();

  try {
    const tour = await Tour.create(
      {
        title,
        subtitle,
        tour_category_id,
        country_id,
        state_id,
        city_id,
        guide_id,
        place,
        completed_steps: 1,
      },
      { transaction }
    );
    if (tags.length > 0) {
      console.log("tags", tags);
      
      const tagRecords = await Promise.all(
        tags.map((tag) =>
          TourTag.findOrCreate({
            where: typeof tag == "string" ? { name: tag } : { id: tag },
            defaults: typeof tag == "string" ? { name: tag } : {},
            transaction,
          })
        )
      );

      const tagIds = tagRecords.map(([tag]) => tag.id);
      console.log("tag_ids", tagIds);
      
      const tourTagMaps = tagIds.map((tag_id) => ({
        tour_id: tour.id,
        tag_id,
      }));

      await TourTagMap.bulkCreate(tourTagMaps, { transaction });
    }

    await transaction.commit();

    return {
      success: true,
      message: "Tour created successfully",
      data: {
        tour_id: tour.id,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};
