import { Op } from "sequelize";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import sequelize from "../config/database.js";
import { 
  Tour,
  TourCategory,
  TourTag,
  TourTagMap,
  Itinerary,
  TourStop,
  TourPrice,
  TourTicket,
  TourOperatingDay,
  TourAvailability
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
        completed_steps: tour.completed_steps,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

// tour creation step 2
export const createTourStepTwoService = async (payload = {}) => {
  const { tour_id, full_description, what_you_will_do, key_highlights, unique_points } = payload;
  console.log("payload",payload);
  
  const transaction = await sequelize.transaction();

  try {
    // find tour
    const tour = await Tour.findByPk(tour_id,{ transaction });
    
    if (!tour) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Tour not found");
    }
    console.log("zzzzzzzzzzzzz");
    
    await Tour.update(
      {
        full_description,
        what_you_will_do,
        key_highlights,
        unique_points,
        completed_steps: 2,
      },
      {
        where: { id: tour_id },
        transaction,
      }
    );

    await transaction.commit();

    return {
      success: true,
      message: "Tour updated successfully",
      data: {
        tour_id:tour.id,
        completed_steps: 2,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

// tour creation step 3 
export const createTourStepThreeService = async (payload = {}) => {
  const {
    tour_id,
    overview,
    stops = [], // optional & repeatable
  } = payload;

  const transaction = await sequelize.transaction();

  try {
    // 1. Find tour
    const tour = await Tour.findByPk(tour_id, { transaction });

    if (!tour) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Tour not found");
    }

    // 2. Create or Update itinerary overview
    const [itinerary] = await Itinerary.upsert(
      {
        tour_id,
        overview
      },
      { transaction }
    );

    // 3. Remove old stops (important for edit flow)
    await TourStop.destroy({
      where: { tour_id: tour_id },
      transaction,
    });

    // 4. Insert stops (if provided)
    if (stops.length > 0) {
      const stopsData = stops.map((stop) => ({
        tour_id,
        stop_name: stop.name,
        description: stop.description,
        duration: stop.approx_duration || null,
      }));

      await TourStop.bulkCreate(stopsData, { transaction });
    }

    // 5. Update completed step
    await Tour.update(
      {
        completed_steps: 3,
      },
      {
        where: { id: tour_id },
        transaction,
      }
    );

    await transaction.commit();

    return {
      success: true,
      message: "Itinerary & stops added successfully",
      data: {
        tour_id: tour.id,
        completed_steps: 3,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

// tour creation step 4
export const createTourStepFourService = async (payload = {}) => {
  const { 
    tour_id, 
    meeting_point_name, 
    meeting_point_address, 
    meeting_point_latitude, 
    meeting_point_longitude, 
    end_point,
    pickup_offered,
    pickup_details 
  } = payload;

  const transaction = await sequelize.transaction();

  try {
    // 1. Find tour
    const tour = await Tour.findByPk(tour_id, { transaction });

    if (!tour) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Tour not found");
    }

    // 2. Update tour
    await Tour.update(
      {
        meeting_point_name,
        meeting_point_address,
        meeting_point_latitude,
        meeting_point_longitude,
        end_point,
        pickup_offered: pickup_offered || true,
        pickup_details,
        completed_steps: 4,
      },
      {
        where: { id: tour_id },
        transaction,
      }
    );

    await transaction.commit();

    return {
      success: true,
      message: "meetingand logistics added successfully",
      data: {
        tour_id: tour.id,
        completed_steps: tour.completed_steps,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
}

// tour creation step 5
export const createTourStepFiveService = async (payload = {}) => {
  const {
    tour_id,
    duration,
    duration_type,
    start_times,
    operating_days, // [1,2,3...7]
    season_start_date,
    season_end_date,
    minimum_travelers,
    maximum_group_size,
  } = payload;

  const transaction = await sequelize.transaction();

  try {
    // 1. Find tour
    const tour = await Tour.findByPk(tour_id, { transaction });

    if (!tour) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Tour not found");
    }

    // 2. Update tour rules
    await Tour.update(
      {
        duration,
        duration_type,
        season_start_date: season_start_date || null,
        season_end_date: season_end_date || null,
        minimum_travelers,
        maximum_group_size,
        is_private_tour: true,
        completed_steps: 5,
      },
      { where: { id: tour_id }, transaction }
    );

    // 3. Reset operating days
    await TourOperatingDay.destroy({
      where: { tour_id },
      transaction,
    });

    const operatingDayRows = operating_days.map((day) => ({
      tour_id,
      day_of_week: day, // 1–7
    }));

    await TourOperatingDay.bulkCreate(operatingDayRows, { transaction });

    // 4. Reset availability
    await TourAvailability.destroy({
      where: { tour_id },
      transaction,
    });

    // 5. Generate availability
    const availabilityRows = [];

    const startDate = new Date(season_start_date);
    const endDate = new Date(season_end_date);

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const jsDay = d.getDay(); // 0–6 (Sun–Sat)
      const dayOfWeek = jsDay == 0 ? 1 : jsDay + 1; // 1–7

      if (!operating_days.includes(dayOfWeek)) continue;

      const availableDate = d.toISOString().split("T")[0];

      for (const time of start_times) {
        availabilityRows.push({
          tour_id,
          available_date: availableDate,
          start_time: time,
          total_capacity: maximum_group_size,
          booked_capacity: 0,
          is_blocked: false,
        });
      }
    }

    if (availabilityRows.length > 0) {
      await TourAvailability.bulkCreate(availabilityRows, { transaction });
    }

    await transaction.commit();

    return {
      success: true,
      message: "Duration, operating days and availability added successfully",
      data: {
        tour_id: tour.id,
        completed_steps: 5,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const createTourStepSixService = async (payload = {}) => {
  const {
    tour_id,
    price,
    currency,
    ticket_required,
    ticket_included,
    adult_price,
    child_price,
    infant_price,
  } = payload;

  const transaction = await sequelize.transaction();
  try {
    // Find tour
    const tour = await Tour.findByPk(tour_id, { transaction });

    if (!tour) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Tour not found");
    }

    if (!ticket_required) {
      await TourPrice.destroy({ where: { tour_id }, transaction });

      await TourPrice.create(
        {
          tour_id,
          // price_type_id,
          price,
          currency,
        },
        { transaction }
      );
    }

    // TICKET PRICE (tour_tickets)
    if (ticket_required) {
      await TourTicket.destroy({ where: { tour_id }, transaction });

      await TourTicket.create(
        {
          tour_id,
          ticket_required,
          ticket_included,
          adult_price,
          child_price,
          infant_price,
          currency,
        },
        { transaction }
      );
    }

    // 4. Mark step completed
    await Tour.update(
      { completed_steps: 6 },
      { where: { id: tour_id }, transaction }
    );

    await transaction.commit();

    return {
      success: true,
      message: "Pricing details saved successfully",
      data: {
        tour_id,
        completed_steps: 7,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
}