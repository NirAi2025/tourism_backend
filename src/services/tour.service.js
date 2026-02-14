import { Op } from "sequelize";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import sequelize from "../config/database.js";
import {
  Tour,
  TourCategory,
  TourLanguage,
  TourMedia,
  TourSafety,
  TourTag,
  TourTagMap,
  Itinerary,
  TourStop,
  TourPolicy,
  TourPrice,
  TourTicket,
  TourOperatingDay,
  TourAvailability,
  TourInclusionExclusion,
  TourSearchTag,
  Country,
  State,
  City,
  Language,
} from "../models/index.js";
import { withFileUrl } from "../config/fileUploadPath.js";

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
      { transaction },
    );
    if (tags.length > 0) {
      console.log("tags", tags);

      const tagRecords = await Promise.all(
        tags.map((tag) =>
          TourTag.findOrCreate({
            where: typeof tag == "string" ? { name: tag } : { id: tag },
            defaults: typeof tag == "string" ? { name: tag } : {},
            transaction,
          }),
        ),
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
        completed_steps: 1,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

// tour creation step 2
export const createTourStepTwoService = async (payload = {}) => {
  const {
    tour_id,
    full_description,
    what_you_will_do,
    key_highlights,
    unique_points,
  } = payload;
  console.log("payload", payload);

  const transaction = await sequelize.transaction();

  try {
    // find tour
    const tour = await Tour.findByPk(tour_id, { transaction });

    if (!tour) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Tour not found");
    }

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
      },
    );

    await transaction.commit();

    return {
      success: true,
      message: "Tour updated successfully",
      data: {
        tour_id: tour.id,
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
        overview,
      },
      { transaction },
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
      },
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
    pickup_details,
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
      },
    );

    await transaction.commit();

    return {
      success: true,
      message: "meetingand logistics added successfully",
      data: {
        tour_id: tour.id,
        completed_steps: 4,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

// tour creation step 5
export const createTourStepFiveService = async (payload = {}) => {
  const {
    tour_id,
    duration,
    duration_type,
    operating_time_slots, // [{ start_time, operating_day }]
    season_start_date,
    season_end_date,
    minimum_travelers,
    maximum_group_size,
  } = payload;

  const AVAILABILITY_WINDOW_DAYS = 365;
  const transaction = await sequelize.transaction();

  try {
    // 1. Validate tour
    const tour = await Tour.findByPk(tour_id, { transaction });
    if (!tour) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Tour not found");
    }

    // 2. Update tour master
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
      { where: { id: tour_id }, transaction },
    );

    // 3. Reset operating days ONLY (availability is rolling now)
    await TourOperatingDay.destroy({ where: { tour_id }, transaction });

    // 4. Derive operating days
    const uniqueOperatingDays = [
      ...new Set(operating_time_slots.map((s) => s.operating_day)),
    ];

    await TourOperatingDay.bulkCreate(
      uniqueOperatingDays.map((day) => ({
        tour_id,
        day_of_week: day,
      })),
      { transaction },
    );

    // 5. Group time slots by day
    const timeSlotsByDay = {};
    for (const { start_time, operating_day } of operating_time_slots) {
      if (!timeSlotsByDay[operating_day]) {
        timeSlotsByDay[operating_day] = [];
      }
      timeSlotsByDay[operating_day].push(start_time);
    }

    // 6. Determine generation window (IMPORTANT 🔥)

    const today = new Date();

    // Find last availability date (for rolling extension)
    const lastAvailability = await TourAvailability.findOne({
      where: { tour_id },
      order: [["available_date", "DESC"]],
      transaction,
    });

    const generationStartDate = lastAvailability
      ? new Date(
          new Date(lastAvailability.available_date).setDate(
            new Date(lastAvailability.available_date).getDate() + 1,
          ),
        )
      : season_start_date
        ? new Date(season_start_date)
        : today;

    let generationEndDate;

    if (season_end_date) {
      generationEndDate = new Date(season_end_date);
    } else {
      generationEndDate = new Date(
        new Date(generationStartDate).setDate(
          generationStartDate.getDate() + AVAILABILITY_WINDOW_DAYS,
        ),
      );
    }

    if (generationStartDate > generationEndDate) {
      await transaction.commit();
      return { success: true, message: "Availability already up to date" };
    }

    // 7. Generate availability (idempotent-safe)
    const availabilityRows = [];

    for (
      let d = new Date(generationStartDate);
      d <= generationEndDate;
      d.setDate(d.getDate() + 1)
    ) {
      const jsDay = d.getDay();
      const dayOfWeek = jsDay === 0 ? 1 : jsDay + 1;

      const slotsForDay = timeSlotsByDay[dayOfWeek];
      if (!slotsForDay) continue;

      const available_date = d.toISOString().slice(0, 10);

      for (const start_time of slotsForDay) {
        availabilityRows.push({
          tour_id,
          available_date,
          start_time,
          total_capacity: maximum_group_size,
          booked_capacity: 0,
          is_blocked: false,
        });
      }
    }

    if (availabilityRows.length) {
      await TourAvailability.bulkCreate(availabilityRows, {
        transaction,
        ignoreDuplicates: true, // VERY IMPORTANT
      });
    }

    await transaction.commit();

    return {
      success: true,
      message: "Tour availability generated successfully",
      data: {
        tour_id,
        generated_till: generationEndDate.toISOString().slice(0, 10),
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong",
    );
  }
};

// tour creation step 6
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
        { transaction },
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
        { transaction },
      );
    }

    // 4. Mark step completed
    await Tour.update(
      { completed_steps: 6 },
      { where: { id: tour_id }, transaction },
    );

    await transaction.commit();

    return {
      success: true,
      message: "Pricing details saved successfully",
      data: {
        tour_id,
        completed_steps: 6,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

// tour creation step 7
export const createTourStepSevenService = async (payload = {}) => {
  const {
    tour_id,
    included,
    excluded,
    optional_addons = null,
    skip_the_line_access = null,
    difficulty_level,
    age_min,
    age_max,
    accessibility_options = null,
    not_suitable_for = null,
  } = payload;

  const transaction = await sequelize.transaction();
  try {
    // Find tour
    const tour = await Tour.findByPk(tour_id, { transaction });

    if (!tour) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Tour not found");
    }

    await TourInclusionExclusion.destroy({ where: { tour_id }, transaction });

    await TourInclusionExclusion.create(
      {
        tour_id,
        included,
        excluded,
        optional_addons,
      },
      { transaction },
    );
    const accessibilityOptions = Array.isArray(accessibility_options)
      ? accessibility_options.join(",")
      : null;

    const notSuitableFor = Array.isArray(not_suitable_for)
      ? not_suitable_for.join(",")
      : null;
    // 4. update restriction section and Mark step completed
    await Tour.update(
      {
        skip_the_line_access,
        difficulty_level,
        accessibility_options: accessibilityOptions,
        not_suitable_for: notSuitableFor,
        age_min,
        age_max,
        completed_steps: 7,
      },
      { where: { id: tour_id }, transaction },
    );

    await transaction.commit();

    return {
      success: true,
      message: "Inclusions and exclusions saved successfully",
      data: {
        tour_id,
        completed_steps: 7,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};
// tour creation step 8
export const createTourStepEightService = async (payload = {}) => {
  const {
    tour_id,
    language_ids = [],
    is_live_guide,
    safety_instructions,
    fitness_requirements = null,
    permit_declared,
    insurance_declared,
  } = payload;

  const transaction = await sequelize.transaction();
  try {
    const tour = await Tour.findByPk(tour_id, { transaction });
    if (!tour) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Tour not found");
    }

    // 1. Reset tour languages
    await TourLanguage.destroy({
      where: { tour_id },
      transaction,
    });

    // 2. Insert languages
    if (language_ids.length > 0) {
      const rows = language_ids.map((language_id) => ({
        tour_id,
        language_id,
        is_live_guide,
      }));

      await TourLanguage.bulkCreate(rows, { transaction });
    }
    //  update in tour safeties table
    await TourSafety.destroy({
      where: { tour_id },
      transaction,
    });
    await TourSafety.create(
      {
        tour_id,
        safety_instructions,
        fitness_requirements,
        permit_declared,
        insurance_declared,
      },
      { transaction },
    );
    // 3. Update tour table
    await Tour.update(
      {
        completed_steps: 8,
      },
      { where: { id: tour_id }, transaction },
    );

    await transaction.commit();

    return {
      success: true,
      message: "Languages and safety details saved successfully",
      data: {
        tour_id,
        completed_steps: 8,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

// tour creation step 9
export const createTourStepNineService = async (payload = {}) => {
  const {
    tour_id,
    cover_image,
    gallery_images = [],
    video_url = null,
    image_rights_confirmation,
  } = payload;

  const transaction = await sequelize.transaction();

  try {
    // 1. Validate tour
    const tour = await Tour.findByPk(tour_id, { transaction });
    if (!tour) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Tour not found");
    }

    if (!image_rights_confirmation) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Image rights confirmation is required",
      );
    }

    // 2. Reset existing media
    await TourMedia.destroy({
      where: { tour_id },
      transaction,
    });

    const mediaRows = [];

    // 3. Cover image (required)
    if (!cover_image) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Cover image is required");
    }

    mediaRows.push({
      tour_id,
      type: "cover",
      media: cover_image,
      url: null,
    });

    // 4. Gallery images (optional)
    if (gallery_images.length > 0) {
      gallery_images.forEach((img) => {
        mediaRows.push({
          tour_id,
          type: "gallery",
          media: img,
          url: null,
        });
      });
    }

    // 5. Video URL (optional)
    if (video_url) {
      mediaRows.push({
        tour_id,
        type: "video",
        media: null,
        url: video_url,
      });
    }

    // 6. Insert media
    await TourMedia.bulkCreate(mediaRows, { transaction });

    // 7. Update completed step
    await Tour.update(
      { completed_steps: 9 },
      { where: { id: tour_id }, transaction },
    );

    await transaction.commit();

    return {
      success: true,
      message: "Tour media & assets saved successfully",
      data: {
        tour_id,
        completed_steps: 9,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw new ApiError(
      error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
    );
  }
};

// tour creation step 10
export const createTourStepTenService = async (payload = {}) => {
  const {
    tour_id,
    cancellation_policy,
    cancellation_cutoff,
    no_show_policy = null,
    weather_policy = null,
    what_to_bring,
    dress_code = null,
    important_notes = null,
  } = payload;

  const transaction = await sequelize.transaction();

  try {
    // 1. Validate tour
    const tour = await Tour.findByPk(tour_id, { transaction });
    if (!tour) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Tour not found");
    }

    // 2. Reset & save policies
    await TourPolicy.destroy({
      where: { tour_id },
      transaction,
    });

    await TourPolicy.create(
      {
        tour_id,
        cancellation_policy,
        cancellation_cutoff,
        no_show_policy,
        weather_policy,
      },
      { transaction },
    );

    // 3. Update customer preparation on tour table
    await Tour.update(
      {
        what_to_bring,
        dress_code,
        important_notes,
        completed_steps: 10, // adjust if needed
      },
      {
        where: { id: tour_id },
        transaction,
      },
    );

    await transaction.commit();

    return {
      success: true,
      message: "Policies and customer preparation saved successfully",
      data: {
        tour_id,
        completed_steps: 10,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

// tour creation step 11
export const createTourStepElevenService = async (payload = {}) => {
  const {
    tour_id,
    seo_title = null,
    seo_description = null,
    search_tags = [],
  } = payload;

  const transaction = await sequelize.transaction();

  try {
    // 1. Validate tour
    const tour = await Tour.findByPk(tour_id, { transaction });
    if (!tour) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Tour not found");
    }

    // 2. Reset & save search tags (tour_tag table)
    if (Array.isArray(search_tags)) {
      await TourSearchTag.destroy({
        where: { tour_id },
        transaction,
      });

      if (search_tags.length > 0) {
        const tagRows = search_tags.map((tag) => ({
          tour_id,
          tag,
        }));

        await TourSearchTag.bulkCreate(tagRows, { transaction });
      }
    }

    // 3. Update SEO fields on tour table
    await Tour.update(
      {
        seo_title,
        seo_description,
        completed_steps: 11,
      },
      {
        where: { id: tour_id },
        transaction,
      },
    );

    await transaction.commit();

    return {
      success: true,
      message: "SEO & internal metadata saved successfully",
      data: {
        tour_id,
        completed_steps: 11,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const myTourProductsService = async ({
  user_id,
  page = 1,
  limit = 10,
} = {}) => {
  try {
    console.log(user_id);
    const pageNumber = Math.max(parseInt(page, 10), 1);
    const pageSize = Math.min(parseInt(limit, 10), 50);
    const offset = (pageNumber - 1) * pageSize;

    const { rows, count } = await Tour.findAndCountAll({
      where: { guide_id: user_id },
      limit: pageSize,
      offset,
      distinct: true,
      include: [
        {
          model: TourCategory,
          as: "tour_category",
          attributes: ["id", "name"],
        },
        {
          model: Country,
          as: "country",
          attributes: ["id", "name"],
        },
        {
          model: State,
          as: "state",
          attributes: ["id", "name"],
        },
        {
          model: City,
          as: "city",
          attributes: ["id", "name"],
        },
        {
          model: TourMedia,
          as: "tour_medias",
          where: { type: "cover" },
          required: false,
          attributes: ["id", "media", "url"],
        },
      ],
      order: [["created_at", "DESC"]],
    });
    const tours = rows.map((tour) => {
      const tourJson = tour.toJSON();

      let cover_image = null;

      if (tourJson.tour_medias?.length > 0) {
        const media = tourJson.tour_medias[0];

        cover_image = {
          id: media.id,
          url: media.media ? withFileUrl(media.media, "tour") : media.url,
        };
      }

      delete tourJson.tour_medias;

      return {
        ...tourJson,
        cover_image,
      };
    });

    return {
      success: true,
      message: "My tours fetched successfully",
      data: { tours },
      pagination: {
        totalRecords: count,
        totalPages: Math.ceil(count / pageSize),
        currentPage: pageNumber,
        pageSize,
      },
    };
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const myTourProductDetailsService = async (id) => {
  try {
    const tour = await Tour.findByPk(id, {
      include: [
        {
          model: TourCategory,
          as: "tour_category",
          attributes: ["id", "name"],
        },
        {
          model: Country,
          as: "country",
          attributes: ["id", "name"],
        },
        {
          model: State,
          as: "state",
          attributes: ["id", "name"],
        },
        {
          model: City,
          as: "city",
          attributes: ["id", "name"],
        },

        {
          model: TourTagMap,
          as: "tour_tag_maps",
          attributes: { exclude: ["created_at", "updated_at"] },
          include: [
            {
              model: TourTag,
              as: "tour_tag",
              attributes: ["id", "name"],
            },
          ],
        },

        {
          model: Itinerary,
          as: "tour_itinerary",
          attributes: { exclude: ["created_at", "updated_at"] },
        },
        {
          model: TourStop,
          as: "tour_stops",
          attributes: { exclude: ["created_at", "updated_at"] },
        },
        {
          model: TourOperatingDay,
          as: "tour_operating_days",
          attributes: { exclude: ["created_at", "updated_at"] },
        },
        {
          model: TourAvailability,
          as: "tour_availabilities",
          attributes: { exclude: ["created_at", "updated_at"] },
        },
        {
          model: TourPrice,
          as: "tour_price",
          attributes: { exclude: ["created_at", "updated_at"] },
        },
        {
          model: TourTicket,
          as: "tour_ticket",
          attributes: { exclude: ["created_at", "updated_at"] },
        },
        {
          model: TourInclusionExclusion,
          as: "tour_inclusion_exclusion",
          attributes: { exclude: ["created_at", "updated_at"] },
        },

        {
          model: TourLanguage,
          as: "tour_languages",
          attributes: { exclude: ["created_at", "updated_at"] },
          include: [
            {
              model: Language,
              as: "language",
              attributes: ["id", "name"],
            },
          ],
        },

        {
          model: TourSafety,
          as: "tour_safety",
          attributes: { exclude: ["created_at", "updated_at"] },
        },
        {
          model: TourMedia,
          as: "tour_medias",
          attributes: ["id", "type", "media", "url"],
        },

        {
          model: TourPolicy,
          as: "tour_policy",
          attributes: { exclude: ["created_at", "updated_at"] },
        },
        {
          model: TourSearchTag,
          as: "tour_search_tags",
          attributes: { exclude: ["created_at", "updated_at"] },
        },
      ],
    });

    if (!tour) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Tour not found");
    }

    const media = {
      cover: null,
      gallery: [],
      videos: [],
    };

    tour.tour_medias?.forEach((item) => {
      if (item.type === "cover") {
        media.cover = item.media ? withFileUrl(item.media, "tours") : item.url;
      }

      if (item.type == "gallery") {
        media.gallery.push(
          item.media ? withFileUrl(item.media, "tours") : item.url,
        );
      }

      if (item.type === "video") {
        media.videos.push(item.url);
      }
    });

    return {
      success: true,
      data: {
        ...tour.toJSON(),
        tour_medias: media, // override raw media
      },
    };
  } catch (error) {
    throw new ApiError(
      error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong",
    );
  }
};
export const updateTourStatusService = async(id) => {
  try {
    const tour = await Tour.findByPk(id);
    if (!tour) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Tour not found");
    }
    tour.update({
      is_active: tour.is_active == true ? false : true,
    });
    return {
      success: true,
      message: "Tour status updated successfully",
      data: tour,
    };
  } catch (error) {
    throw new ApiError(
      error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong",
    );
  }
}