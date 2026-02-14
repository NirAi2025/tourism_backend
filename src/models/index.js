import sequelize from "../config/database.js";
import User from "./user.model.js";
import Role from "./role.model.js";
import UserRole from "./user_role.model.js";
import Country from "./country.model.js";
import State from "./state.model.js";
import City from "./city.model.js";
import Language from "./language.model.js";
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
import TourCategory from "./tourCategory.model.js";
import Tour from "./tour.model.js";
import Itinerary from "./itinerary.model.js";
import TourSearchTag from "./tourSearchTag.model.js";
import PriceType from "./priceType.model.js";
import TourLanguage from "./tourLanguage.model.js";
import TourMedia from "./tourMedia.model.js";
import TourOperatingDay from "./tourOperatingDay.model.js";
import TourOtherPrice from "./tourOtherPrice.model.js";
import TourPolicy from "./tourPolicy.model.js";
import TourPrice from "./tourPrice.model.js";
import TourSafety from "./tourSafety.model.js";
import TourStop from "./tourStop.model.js";
import TourTag from "./tourTag.model.js";
import TourTagMap from "./tourTagMap.model.js";
import TourTicket from "./tourTicket.model.js";
import TourAvailability from "./tourAvailability.model.js";
import TourInclusionExclusion from "./tourInclusionExclusion.model.js";
import Wishlist from "./wishlist.model.js";


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

Profile.belongsTo(City, { foreignKey: "base_city_id", as: "base_city" });
Profile.belongsTo(Country, { foreignKey: "nationality", as: "nationality_country" });
Profile.belongsTo(Country, {foreignKey: "tour_country_id", as: "tour_country" });
Profile.belongsTo(State, {foreignKey: "state_id", as: "state" });


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
GuideLanguage.belongsTo(Language, { foreignKey: "language_id" });

GuideCertification.belongsTo(User, { foreignKey: "guide_id" });
User.hasMany(GuideCertification, { foreignKey: "guide_id" });

GuideInsurance.belongsTo(User, { foreignKey: "guide_id", as: "guide_insurance" });
User.hasOne(GuideInsurance, { foreignKey: "guide_id" });

GuidePayoutAccount.belongsTo(User, { foreignKey: "guide_id", as: "guide_payout_account" });
User.hasOne(GuidePayoutAccount, { foreignKey: "guide_id" });
GuidePayoutAccount.belongsTo(Country, { foreignKey: "tax_residency_country_id", as: "tax_residency_country" });

GuidePublicProfile.belongsTo(User, { foreignKey: "guide_id" });
User.hasOne(GuidePublicProfile, { foreignKey: "guide_id" });

// --------------------------------------------------------------- tour associations---------------------------------------------------------------

Tour.belongsTo(TourCategory, { foreignKey: "tour_category_id"});
TourCategory.hasMany(Tour, { foreignKey: "tour_category_id" });

Tour.hasOne(Itinerary, { foreignKey: "tour_id"});
Itinerary.belongsTo(Tour, { foreignKey: "tour_id" });

Tour.hasMany(TourStop, { foreignKey: "tour_id"});
TourStop.belongsTo(Tour, { foreignKey: "tour_id" });

Tour.hasMany(TourSearchTag, { foreignKey: "tour_id"});
TourSearchTag.belongsTo(Tour, { foreignKey: "tour_id"});

// Tour.belongsToMany(TourTag, { through: TourTagMap, foreignKey: "tour_id", otherKey: "tag_id", as: "tags" });
// TourTag.belongsToMany(Tour, { through: TourTagMap, foreignKey: "tag_id", otherKey: "tour_id" });

Tour.hasMany(TourLanguage, { foreignKey: "tour_id"});
TourLanguage.belongsTo(Tour, { foreignKey: "tour_id" });

Tour.hasMany(TourMedia, { foreignKey: "tour_id"});
TourMedia.belongsTo(Tour, { foreignKey: "tour_id" });

Tour.hasMany(TourOperatingDay, { foreignKey: "tour_id"});
TourOperatingDay.belongsTo(Tour, { foreignKey: "tour_id" });

Tour.hasOne(TourPrice, { foreignKey: "tour_id"});
TourPrice.belongsTo(Tour, { foreignKey: "tour_id" });

Tour.hasMany(TourOtherPrice, { foreignKey: "tour_id"});
TourOtherPrice.belongsTo(Tour, { foreignKey: "tour_id" });

TourPrice.belongsTo(PriceType, { foreignKey: "price_type_id"});
PriceType.hasMany(TourPrice, { foreignKey: "price_type_id" });

Tour.hasOne(TourTicket, { foreignKey: "tour_id"});
TourTicket.belongsTo(Tour, { foreignKey: "tour_id" });

Tour.hasOne(TourPolicy, { foreignKey: "tour_id"});
TourPolicy.belongsTo(Tour, { foreignKey: "tour_id" });

Tour.hasOne(TourSafety, { foreignKey: "tour_id"});
TourSafety.belongsTo(Tour, { foreignKey: "tour_id" });

Tour.hasMany(TourAvailability, { foreignKey: "tour_id"});
TourAvailability.belongsTo(Tour, { foreignKey: "tour_id" });

TourInclusionExclusion.belongsTo(Tour, { foreignKey: "tour_id" });
Tour.hasOne(TourInclusionExclusion, { foreignKey: "tour_id" });

Tour.belongsTo(Country, { foreignKey: "country_id"});
Tour.belongsTo(State, { foreignKey: "state_id"});
Tour.belongsTo(City, { foreignKey: "city_id"});

Tour.hasMany(TourTagMap, { foreignKey: "tour_id"});
TourTagMap.belongsTo(Tour, { foreignKey: "tour_id"});
TourTag.hasMany(TourTagMap, { foreignKey: "tag_id"});
TourTagMap.belongsTo(TourTag, { foreignKey: "tag_id" });

TourLanguage.belongsTo(Language, { foreignKey: "language_id" });
Language.hasMany(TourLanguage, { foreignKey: "language_id" });

Tour.belongsTo(User, { foreignKey: "guide_id"});


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
  Language,
  Permission,
  Profile,
  RolePermission,
  Setting,
  UserEmailVerification,
  GuidePayoutAccount,
  GuidePublicProfile,
  GuideCertification,
  GuideLanguage,
  GuideVerification,
  GuideBankInfo,
  TourCategory,
  Tour,
  Itinerary,
  TourSearchTag,
  PriceType,
  TourLanguage,
  TourMedia,
  TourOperatingDay,
  TourOtherPrice,
  TourPolicy,
  TourPrice,
  TourSafety,
  TourStop,
  TourTag,
  TourTagMap,
  TourTicket,
  TourAvailability,
  TourInclusionExclusion,
  Wishlist
};
