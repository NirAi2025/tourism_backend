import sequelize from "../config/database.js";
import User from "./user.model.js";
import Role from "./role.model.js";
import UserRole from "./user_role.model.js";
import Country from "./country.model.js";
import State from "./state.model.js";
import City from "./city.model.js";
import Permission from "./permission.model.js";
import RolePermission from "./role_permission.model.js";
import Setting from "./setting.model.js";
import CMS from "./cms.model.js";
import BlogType from "./blogType.model.js";
import Blog from "./blog.model.js";
import Category from "./category.model.js";

/*
|--------------------------------------------------------------------------
| ASSOCIATIONS
|--------------------------------------------------------------------------
*/

User.belongsToMany(Role, {through: UserRole, foreignKey: "user_id", otherKey: "role_id" });
Role.belongsToMany(User, {through: UserRole, foreignKey: "role_id", otherKey: "user_id" });

Role.belongsToMany(Permission, {through: RolePermission, foreignKey: "role_id", otherKey: "permission_id" });
Permission.belongsToMany(Role, {through: RolePermission, foreignKey: "permission_id", otherKey: "role_id" });

Country.hasMany(State, { foreignKey: "country_id" });
State.belongsTo(Country, { foreignKey: "country_id" });

State.hasMany(City, { foreignKey: "state_id" });
City.belongsTo(State, { foreignKey: "state_id" });

Country.hasMany(City, { foreignKey: "country_id" });
City.belongsTo(Country, { foreignKey: "country_id" });

BlogType.hasMany(Blog, { foreignKey: "blog_type_id" });
Blog.belongsTo(BlogType, { foreignKey: "blog_type_id" });

Blog.belongsTo(City, { foreignKey: "city_id" });
Blog.belongsTo(User, { foreignKey: "user_id" });

Category.hasMany(Blog, { foreignKey: "category_id" });
Category.belongsTo(Category, { foreignKey: "parent_id", as: "parentCategory" });

export {
  sequelize,
  BlogType,
  Blog,
  CMS,
  User,
  Role,
  UserRole,
  Country,
  State,
  City,
  Permission,
  RolePermission,
  Setting,
};
