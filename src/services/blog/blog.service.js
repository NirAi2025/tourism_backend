import { BlogType, Blog, User, City } from "../../models/index.js";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/ApiError.js";

export const allBlogTypesService = async () => {
  const blogTypes = await BlogType.findAll({
    order: [["created_at", "DESC"]],
  });
  return blogTypes;
};

export const blogTypeByIdService = async (id) => {
  const blogType = await BlogType.findByPk(id);
  return blogType;
};

export const createOrUpdateBlogTypeService = async (payload, id = null) => {
  if (id) {
    // Update existing Blog Type
    payload.updated_at = new Date();
    const [updatedCount] = await BlogType.update(payload, { where: { id } });
    if (updatedCount == 0) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Blog Type not found for id ${id}`
      );
    }
    return await BlogType.findByPk(id);
  } else {
    // Create new Blog Type
    payload.created_at = new Date();
    const newBlogType = await BlogType.create(payload);
    return newBlogType;
  }
};

export const deleteBlogTypeService = async (id) => {
  // check if any blog is associated with this blog type
  const associatedBlogs = await Blog.findOne({ where: { blog_type_id: id } });
  if (associatedBlogs) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Cannot delete Blog Type with id ${id} as it is associated with existing blogs`
    );
  }
  const deletedBlogType = await BlogType.destroy({ where: { id } });
  return deletedBlogType;
};

export const allBlogsService = async ({ ...filters } = {}) => {
  const filterWhere = {};
  if (filters.trending) {
    filterWhere.total_viewes = { [Op.gte]: 100 };
  }
  if (filters.city_id) {
    filterWhere.city_id = filters.city_id;
  }
  if (filters.blog_type_id) {
    filterWhere.blog_type_id = filters.blog_type_id;
  }
  if (filters.user_id) {
    filterWhere.user_id = filters.user_id;
  }

  const blogs = await Blog.findAll({
    where: filterWhere,
    include: [
      {
        model: User,
        attributes: ["id", "name", "email"],
      },
      {
        model: BlogType,
        attributes: ["id", "name", "slug"],
      },
      {
        model: City,
        attributes: ["id", "name"],
      },
    ],
    order: [["created_at", "DESC"]],
  });
  return blogs;
};

export const blogByIdOrSlugService = async ({ id, slug }) => {
  const whereClause = {};
  if (id) {
    whereClause.id = id;
  }
  if (slug) {
    whereClause.slug = slug;
  }
  const blog = await Blog.findOne({ where: whereClause });
  return blog;
};

export const createOrUpdateBlogService = async (payload, id = null) => {
  if (id) {
    // Update existing Blog
    payload.updated_at = new Date();
    const [updatedCount] = await Blog.update(payload, { where: { id } });
    if (updatedCount == 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, `Blog not found for id ${id}`);
    }
    return await Blog.findByPk(id);
  } else {
    // Create new Blog
    payload.created_at = new Date();
    const newBlog = await Blog.create(payload);
    return newBlog;
  }
};

export const deleteBlogService = async (id) => {
  const deletedBlog = await Blog.destroy({ where: { id } });
  return deletedBlog;
};
