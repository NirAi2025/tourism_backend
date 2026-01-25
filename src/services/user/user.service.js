import { 
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
    attributes: { exclude: ["password"] },
    include: [
      { model: Role, as: "roles" },
      { model: Profile, as: "profile" },
      { model: GuideIdentity, as: "guide_identities" },
      { model: GuideLicense, as: "guide_licenses" },
      { model: GuideInsurance, as: "guide_insurances" },
      { model: GuidePayoutAccount, as: "guide_payout_accounts" },
      { model: GuidePublicProfile, as: "guide_public_profile" },
      { model: GuideLanguage, as: "guide_languages" },
      { model: GuideCertification, as: "guide_certifications" },
    ],
  });

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  const data = user.toJSON();

  if (data.guide_public_profile?.profile_photo) {
    data.guide_public_profile.profile_photo = withFileUrl(
      data.guide_public_profile.profile_photo,
      "profile"
    );
  }

  data.guide_identities?.forEach(d =>
    d.document_file = withFileUrl(d.document_file, "identity-doc")
  );

  data.guide_licenses?.forEach(l =>
    l.document_file = withFileUrl(l.document_file, "identity-doc")
  );

  data.guide_insurances?.forEach(i =>
    i.insurance_document = withFileUrl(i.insurance_document, "identity-doc")
  );

  data.guide_certifications?.forEach(c =>
    c.certificate_file = withFileUrl(c.certificate_file, "identity-doc")
  );

  return data;
};
