import { StatusCodes } from "http-status-codes";
import { CMS } from "../../models/index.js";
import ApiError from "../../utils/ApiError.js";

export const allCms = async () => {
  const cmsPages = await CMS.findAll({
    order: [["created_at", "DESC"]],
  });
  return cmsPages;
};
export const cmsByIdOrSlug = async ({ id, slug }) => {
  const whereClause = {};
  if (id) {
    whereClause.id = id;
  }
  if (slug) {
    whereClause.slug = slug;
  }
  const cmsPage = await CMS.findOne({ where: whereClause });
  return cmsPage;
};
export const createOrUpdateCms = async (payload, id = null) => {
  if (id) {

    // Update existing CMS
    payload.updated_at = new Date();
    const [updatedCount] = await CMS.update(payload, { where: { id } });
    if (updatedCount == 0) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `CMS page not found for id ${id}`
      );
    }
    return await CMS.findByPk(id);
  } else {
    // Create new CMS
    payload.created_at = new Date();
    const newCms = await CMS.create(payload);
    return newCms;
  }
};
export const deleteCms = async (id) => {
  const deletedCms = await CMS.destroy({ where: { id } });
  return deletedCms;
};
