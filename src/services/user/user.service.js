import { User, Role } from "../../models/index.js";

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

  // -------------------------------
  // Pagination logic
  // -------------------------------
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
