import {
  Country,
  City,
  Language,
  State,
  User,
  Role,
  Profile,
  GuideIdentity,
  GuideLicense,
  GuideInsurance,
  GuidePayoutAccount,
  GuidePublicProfile,
  GuideLanguage,
  GuideCertification,
} from "../../models/index.js";
import { StatusCodes } from "http-status-codes";
import sequelize from "../../config/database.js";
import ApiError from "../../utils/ApiError.js";
import { withFileUrl } from "../../config/fileUploadPath.js";
import GuideVerification from "../../models/guideVerification.model.js";

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
          {
            model: Country,
            as: "nationality_country",
            attributes: ["id", "name"],
          },
          {
            model: Country,
            as: "tour_country",
            attributes: ["id", "name"],
          },
          {
            model: State,
            as: "state",
            attributes: ["id", "name"],
          },
          {
            model: City,
            as: "base_city",
            attributes: ["id", "name"],
          },
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
    ],
  });

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  const data = user.toJSON();

  // File URL mapping
  if (data.guide_public_profile?.profile_photo) {
    data.guide_public_profile.profile_photo = withFileUrl(
      data.guide_public_profile.profile_photo,
      "profile",
    );
  }

  data.guide_identities?.forEach(
    (d) => (d.document_file = withFileUrl(d.document_file, "identity-doc")),
  );

  data.guide_licenses?.forEach(
    (l) => (l.document_file = withFileUrl(l.document_file, "identity-doc")),
  );

  if (data.guide_insurance?.insurance_document) {
    data.guide_insurance.insurance_document = withFileUrl(
      data.guide_insurance.insurance_document,
      "identity-doc",
    );
  }

  data.guide_certifications?.forEach(
    (c) =>
      (c.certificate_file = withFileUrl(c.certificate_file, "identity-doc")),
  );

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
