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
import Profile from "./profile.model.js";
import GuideIdentity from "./guideIdentity.model.js";
import GuideVerification from "./guideVerification.model.js";
import GuideBankInfo from "./guideBankInfo.model.js";
import GuideCertification from "./guideCertification.model.js";
import GuideInsurance from "./guideInsurance.model.js";
import GuideLanguage from "./guideLanguage.model.js";
import GuideLicense from "./guideLicence.model.js";
import GuidePayoutAccount from "./guidePayoutAccount.model.js";
import GuidePublicProfile from "./guidePublicProfile.model.js";
import UserEmailVerification from "./userEmailVerification.model.js";

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

Profile.belongsTo(User, { foreignKey: "user_id" });
User.hasOne(Profile, { foreignKey: "user_id" });

Profile.belongsTo(City, { foreignKey: "base_city_id" });

GuideIdentity.belongsTo(User, { foreignKey: "guide_id" });
User.hasMany(GuideIdentity, { foreignKey: "guide_id" });

GuideLicense.belongsTo(User, { foreignKey: "guide_id" });
User.hasMany(GuideLicense, { foreignKey: "guide_id" });

GuideVerification.belongsTo(User, { foreignKey: "guide_id" });
User.hasMany(GuideVerification, { foreignKey: "guide_id" });

GuideBankInfo.belongsTo(User, { foreignKey: "guide_id" });
User.hasMany(GuideBankInfo, { foreignKey: "guide_id" });

UserEmailVerification.belongsTo(User, { foreignKey: "user_id" });
User.hasOne(UserEmailVerification, { foreignKey: "user_id" });

GuideLanguage.belongsTo(User, { foreignKey: "guide_id" });
User.hasMany(GuideLanguage, { foreignKey: "guide_id" });

GuideCertification.belongsTo(User, { foreignKey: "guide_id" });
User.hasMany(GuideCertification, { foreignKey: "guide_id" });

export {
  sequelize,
  BlogType,
  Blog,
  CMS,
  GuideIdentity,
  GuideLicense,
  GuideInsurance,
  User,
  Role,
  UserRole,
  Country,
  State,
  City,
  Category,
  Permission,
  Profile,
  RolePermission,
  Setting,
  UserEmailVerification,
  GuidePayoutAccount,
  GuidePublicProfile,
  GuideCertification,
  GuideLanguage
};
