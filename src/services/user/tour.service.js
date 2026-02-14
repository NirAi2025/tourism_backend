import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/ApiError.js";
import sequelize from "../../config/database.js";
import { 
  Tour, 
  User, 
  Wishlist, 
  TourAvailability, 
  TourPrice, 
  TourTicket, 
  City
} from "../../models/index.js";
import { withFileUrl } from "../../config/fileUploadPath.js";
import { Op } from "sequelize";
import moment from "moment";

export const wishlistTourService = async (tourId, userId) => {
  const tour = await Tour.findByPk(tourId);
  if (!tour) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Tour not found");
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  const existing = await Wishlist.findOne({
    where: { tour_id: tourId, user_id: userId },
  });

  if (existing) {
    await existing.destroy();
    return {
      message: "Tour removed from wishlist",
      is_wishlisted: false,
    };
  }

  await Wishlist.create({
    tour_id: tourId,
    user_id: userId,
  });

  return {
    message: "Tour added to wishlist",
    is_wishlisted: true,
  };
};
export const myWishlistedToursService = async (userId) => {
  const wishlist = await Wishlist.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Tour,
        as: "tour",
        include: [
          {
            model: TourCategory,
            as: "category",
            attributes: ["id", "name"],
          },
          {
            model: City,
            as: "tour_city",
            attributes: ["id", "name"],
          },
          {
            model: TourMedia,
            as: "tour_media",
            where: { type: "cover" }, 
            required: false,
            attributes: ["id", "media", "url", "type"],
          },
        ],
      },
    ],
    order: [["created_at", "DESC"]],
  });

  const tours = wishlist.map((item) => {
    const tour = item.tour;

    const coverMedia = tour?.tour_media?.[0];

    return {
      id: tour.id,
      title: tour.title,
      category: tour.category,
      city: tour.tour_city,
      cover_image: coverMedia
        ? coverMedia.media
          ? withFileUrl(coverMedia.media, "tours")
          : coverMedia.url
        : null,
    };
  });

  return {
    success: true,
    message: "Wishlisted tours fetched successfully",
    data: { tours },
  };
};

export const getAllToursService = async ({
  cityId,
  guideId,
  page = 1,
  limit = 10,
} = {}) => {
  const where = {};

  if (cityId) where.city_id = cityId;
  if (guideId) where.guide_id = guideId;

  const pageNumber = Math.max(parseInt(page, 10), 1);
  const pageSize = Math.min(parseInt(limit, 10), 50);
  const offset = (pageNumber - 1) * pageSize;

  const { rows, count } = await Tour.findAndCountAll({
    where,
    distinct: true,
    limit: pageSize,
    offset,
    attributes: [
      "id",
      "title",
      "slug",
      "city_id",
      "guide_id",
      "created_at",
    ],
    include: [
      {
        model: TourMedia,
        as: "tour_media",
        where: { type: "cover" },
        required: false,
        attributes: ["id", "url"],
      },
      {
        model: User,
        as: "guide",
        attributes: ["id", "name"],
        include: [
          {
            model: GuidePublicProfile,
            as: "public_profile",
            attributes: ["profile_image"],
          },
        ],
      },
    ],
    order: [["created_at", "DESC"]],
  });

  return {
    data: rows,
    pagination: {
      totalRecords: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: pageNumber,
      pageSize,
    },
  };
};



export const tourAvailabilityAndPriceService = async ({
  tour_id,
  month = null,
  year = null,
}) => {
  const tour = await Tour.findByPk(tour_id);

  if (!tour) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Tour not found");
  }

  let startDate;
  let endDate;

  if (month && year) {
    startDate = moment(`${year}-${month}-01`)
      .startOf("month")
      .format("YYYY-MM-DD");

    endDate = moment(startDate)
      .endOf("month")
      .format("YYYY-MM-DD");
  } else {
    const now = moment();

    startDate = now.startOf("month").format("YYYY-MM-DD");

    endDate = moment()
      .add(1, "month")
      .endOf("month")
      .format("YYYY-MM-DD");
  }

  const availabilities = await TourAvailability.findAll({
    where: {
      tour_id,
      available_date: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  const price = await TourPrice.findOne({
    where: {
      tour_id,
      // start_date: { [Op.lte]: endDate },
      // end_date: { [Op.gte]: startDate },
    },
  });

  const ticket = await TourTicket.findOne({
    where: { tour_id },
  });

  const calendar = availabilities.map((item) => {
    const date = moment(item.available_date).format("YYYY-MM-DD");

    // const applicablePrice = prices.find(
    //   (p) =>
    //     moment(date).isSameOrAfter(p.start_date) &&
    //     moment(date).isSameOrBefore(p.end_date)
    // );

    return {
      date,
      start_time: item.start_time,
      available: item.is_blocked == 0,
      total_capacity: item.total_capacity,
      booked_capacity: item.booked_capacity,
      price: ticket?.adult_price || price?.price || 0,
      currency: ticket?.currency || price?.currency || "USD",
    };
  });

  return {
    message: "Tour availability and price fetched successfully",
    data: {
      tour_id,
      from: startDate,
      to: endDate,
      calendar,
    },
  };
};

