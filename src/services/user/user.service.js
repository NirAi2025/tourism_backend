import {
  Country,
  City,
  Language,
  State,
  User,
  Role,
  Profile,
  Tour,
  Wishlist,
  WishlistTour,
  GuideIdentity,
  GuideLicense,
  GuideInsurance,
  GuidePayoutAccount,
  GuidePublicProfile,
  GuideLanguage,
  GuideCertification,
  GuideVerification,
  TourMedia,
  TourPrice,
  TourTicket,
} from "../../models/index.js";
import { StatusCodes } from "http-status-codes";
import sequelize from "../../config/database.js";
import ApiError from "../../utils/ApiError.js";
import { withFileUrl } from "../../config/fileUploadPath.js";

export const getAllUserService = async ({
  type,
  page = 1,
  limit = 10,
  ...filters
} = {}) => {
  if (![1, 2].includes(type)) {
    throw new Error("Invalid user type");
  }

  const roleMap = {
    1: "user",
    2: "guide",
  };

  const userWhere = {};

  //   if (filters.status !== undefined) {
  //     userWhere.status = filters.status;
  //   }

  if (filters.email) {
    userWhere.email = filters.email;
  }
  const pageNumber = Math.max(parseInt(page, 10), 1);
  const pageSize = Math.min(parseInt(limit, 10), 50); // max 50 per page
  const offset = (pageNumber - 1) * pageSize;

  const { rows, count } = await User.findAndCountAll({
    where: userWhere,
    limit: pageSize,
    offset,
    distinct: true,
    include: [
      {
        model: Role,
        where: { slug: roleMap[type] },
        through: { attributes: [] },
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

export const userDetailsByIdService = async (userId) => {

  const user = await User.findOne({
    where: { id: userId },
    include: [
      { model: Role, as: "roles", through: { attributes: [] } },

      {
        model: Profile,
        as: "profile",
        include: [
          { model: Country, as: "nationality_country", attributes: ["id", "name"] },
          { model: Country, as: "tour_country", attributes: ["id", "name"] },
          { model: State, as: "state", attributes: ["id", "name"] },
          { model: City, as: "base_city", attributes: ["id", "name"] },
        ],
      },

      { model: GuideIdentity, as: "guide_identities" },
      { model: GuideLicense, as: "guide_licenses" },
      { model: GuideInsurance, as: "guide_insurance" },

      {
        model: GuidePayoutAccount,
        as: "guide_payout_account",
        include: [
          {
            model: Country,
            as: "tax_residency_country",
            attributes: ["id", "name"],
          },
        ],
      },

      { model: GuidePublicProfile, as: "guide_public_profile" },

      {
        model: GuideLanguage,
        as: "guide_languages",
        include: [{ model: Language, attributes: ["id", "name"] }],
      },

      { model: GuideCertification, as: "guide_certifications" },

      {
        model: Tour,
        as: "tours",
        required: false,
        where: { status: 1, is_verified: 1 },
        include: [
          {
            model: TourMedia,
            as: "tour_medias",
            where: { type: "cover" },
            required: false,
            attributes: ["id", "type", "media"]
          },
          {
            model: Country,
            as: "country",
            attributes: ["id", "name"]
          },
          {
            model: State,
            as: "state",
            attributes: ["id", "name"]
          },
          {
            model: City,
            as: "city",
            attributes: ["id", "name"]
          },
          {
            model: TourPrice,
            as: "tour_price",
            required: false,
            attributes: ["id", "currency", "price"]
          },
          {
            model: TourTicket,
            as: "tour_ticket",
            required: false,
            attributes: ["id", "adult_price"]
          }
        ],
      },
    ],
  });

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  const data = user.toJSON();

  // ---------------------------
  // File URL Mapping
  // ---------------------------

  if (data.guide_public_profile?.profile_photo) {
    data.guide_public_profile.profile_photo = withFileUrl(
      data.guide_public_profile.profile_photo,
      "profile"
    );
  }

  data.guide_identities?.forEach((d) => {
    if (d.document_file) {
      d.document_file = withFileUrl(d.document_file, "identity-doc");
    }
  });

  data.guide_licenses?.forEach((l) => {
    if (l.document_file) {
      l.document_file = withFileUrl(l.document_file, "identity-doc");
    }
  });

  if (data.guide_insurance?.insurance_document) {
    data.guide_insurance.insurance_document = withFileUrl(
      data.guide_insurance.insurance_document,
      "identity-doc"
    );
  }

  data.guide_certifications?.forEach((c) => {
    if (c.certificate_file) {
      c.certificate_file = withFileUrl(c.certificate_file, "identity-doc");
    }
  });

  // ---------------------------
  // Tour Media + Ratings
  // ---------------------------

  data.tours?.forEach((tour) => {

    if (tour.tour_medias?.length) {
      tour.tour_medias.forEach((media) => {
        if (media.media) {
          media.media = withFileUrl(media.media, "tour");
        }
      });
    }

    // Temporary static values
    tour.overall_ratings = 4.5;
    tour.total_reviews = 1200;

  });

  // Guide overall rating
  data.overall_ratings = 4.5;
  data.total_reviews = 1200;

  return data;
};


export const verifyGuideIdentityService = async (payload = {}) => {
  const transaction = await sequelize.transaction();

  try {
    const { userId, guideId, documentId, status, remarks } = payload;
    if (![1, 2].includes(status)) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Invalid verification status",
      );
    }
    const guideIdentity = await GuideIdentity.findOne({
      where: {
        id: documentId,
        guide_id: guideId,
      },
      transaction,
    });
    if (!guideIdentity) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Guide identity document not found",
      );
    }
    await guideIdentity.update(
      {
        verification_status: status,
        rejection_reason: status == 2 ? remarks : null,
      },
      { transaction },
    );
    // store data for log
    await GuideVerification.create(
      {
        guide_id: guideId,
        verified_by: userId,
        verification_date: new Date(),
        status: status,
        remarks: remarks,
      },
      { transaction },
    );
    await transaction.commit();

    return {
      message: "Document verification status updated successfully",
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const verifyGuideLicenseService = async (payload = {}) => {
  const transaction = await sequelize.transaction();

  try {
    const { userId, guideId, documentId, status, remarks } = payload;
    if (![1, 2].includes(status)) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Invalid verification status",
      );
    }
    const guideLicense = await GuideLicense.findOne({
      where: {
        id: documentId,
        guide_id: guideId,
      },
      transaction,
    });
    if (!guideLicense) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Guide license document not found",
      );
    }
    await guideLicense.update(
      {
        verification_status: status,
        rejection_reason: status == 2 ? remarks : null,
      },
      { transaction },
    );
    // store data for log
    await GuideVerification.create(
      {
        guide_id: guideId,
        verified_by: userId,
        verification_date: new Date(),
        status: status,
        remarks: remarks,
      },
      { transaction },
    );
    await transaction.commit();

    return {
      message: "Document verification status updated successfully",
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const verifyOverallGuideAccountService = async (payload = {}) => {
  const transaction = await sequelize.transaction();

  try {
    const { userId, guideId, status, remarks } = payload;

    const verificationStatus = Number(status);
    if (![1, 2].includes(verificationStatus)) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Invalid verification status",
      );
    }

    const guideExists = await User.count({
      where: { id: guideId },
      include: [
        {
          model: Role,
          where: { slug: "guide" },
          through: { attributes: [] },
        },
      ],
      transaction,
    });

    if (!guideExists) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Guide not found");
    }

    const [updatedRows] = await User.update(
      { is_verified: verificationStatus },
      {
        where: { id: guideId },
        transaction,
      },
    );
    console.log("updatedRows", updatedRows);
    if (updatedRows == 0) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to update guide verification status",
      );
    }

    await GuideVerification.create(
      {
        guide_id: guideId,
        verified_by: userId,
        status: verificationStatus,
        remarks,
        verification_date: new Date(),
      },
      { transaction },
    );

    await transaction.commit();

    return {
      success: true,
      message: "Guide account status updated successfully",
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const updateSelectedCityService = async (user_id, city_id) => {
  const city = await City.findByPk(city_id);
  if (!city) {
    throw new ApiError(StatusCodes.NOT_FOUND, "City not found");
  }
  const isUser = await User.findByPk(user_id);
  if (!isUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
  const isCityIdUpdated = await isUser.update({
    selected_city_id: city_id,
  });
  if (!isCityIdUpdated) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to update selected city",
    );
  }
  return isCityIdUpdated;
};

export const addOrUpdateOrDeleteWishListService = async (userId, name, wishlistId) => {
  const transaction = await sequelize.transaction();

  try {
    // UPDATE WISHLIST
    if (wishlistId && name) {
      const wishlist = await Wishlist.findOne({
        where: { id: wishlistId, user_id: userId },
        transaction
      });

      if (!wishlist) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Wishlist not found");
      }

      wishlist.name = name;
      await wishlist.save({ transaction });
      await transaction.commit();
      return {
        message: "Wishlist updated successfully"
      };  
    }
    // CREATE WISHLIST
    if (!wishlistId && name) {
      const wishlist = await Wishlist.create(
        {
          user_id: userId,
          name,
          is_default: false
        },
        { transaction }
      );
      await transaction.commit();
      return {
        message: "Wishlist created successfully",
        wishlist_id: wishlist.id
      };
    }
    // DELETE WISHLIST
    if (wishlistId && !name) {
      const wishlist = await Wishlist.findOne({
        where: { id: wishlistId, user_id: userId },
        transaction
      });
      if (!wishlist) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Wishlist not found");
      }
      // delete related tours
      await WishlistTour.destroy({
        where: { wishlist_id: wishlistId },
        transaction
      });
      // delete wishlist
      await wishlist.destroy({ transaction });
      await transaction.commit();
      return {
        message: "Wishlist deleted successfully"
      };
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid request");
  } catch (error) {
    await transaction.rollback();
    throw error;

  }
};
export const toggleWishlistService = async (userId, tourId, wishlistId = null) => {

  const transaction = await sequelize.transaction();

  try {

    // validate tour
    const tour = await Tour.findByPk(tourId, { transaction });
    if (!tour) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Tour not found");
    }

    let targetWishlistId = wishlistId;

    // ---------------------------------
    // If wishlistId not provided -> get default
    // ---------------------------------
    if (!wishlistId) {

      const [defaultWishlist] = await Wishlist.findOrCreate({
        where: { user_id: userId, is_default: true },
        defaults: {
          user_id: userId,
          name: "Favourite",
          is_default: true
        },
        transaction
      });

      targetWishlistId = defaultWishlist.id;
    } else {

      const wishlist = await Wishlist.findOne({
        where: { id: wishlistId, user_id: userId },
        transaction
      });

      if (!wishlist) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Wishlist not found");
      }

      targetWishlistId = wishlist.id;
    }

    // ---------------------------------
    // Find existing wishlistTour
    // ---------------------------------
    const existing = await WishlistTour.findOne({
      where: { tour_id: tourId },
      transaction
    });

    // CASE 1: Exists in same wishlist -> remove
    if (existing && existing.wishlist_id === targetWishlistId) {

      await existing.destroy({ transaction });
      await transaction.commit();

      return {
        message: "Tour removed from wishlist",
        is_wishlisted: false
      };
    }

    // CASE 2: Exists in another wishlist -> move
    if (existing && targetWishlistId != null && existing.wishlist_id !== targetWishlistId) {
      console.log("hereee ---> ", existing, targetWishlistId);
      
      existing.wishlist_id = targetWishlistId;
      await existing.save({ transaction });

      await transaction.commit();

      return {
        message: "Tour moved to selected wishlist",
        is_wishlisted: true
      };
    }else{
      console.log("hereee ---> ", existing, targetWishlistId);
      // CASE 3: Exists but no target wishlist (should not happen as we create default if not provided) -> remove
      if(existing){
        await existing.destroy({ transaction });
        await transaction.commit();
  
        return {
          message: "Tour removed from wishlist",
          is_wishlisted: false
        };
      }
    }

    // CASE 3: Not exists -> create
    await WishlistTour.create(
      {
        wishlist_id: targetWishlistId,
        tour_id: tourId
      },
      { transaction }
    );

    await transaction.commit();

    return {
      message: "Tour added to wishlist",
      is_wishlisted: true
    };

  } catch (error) {

    await transaction.rollback();
    throw error;

  }
};

