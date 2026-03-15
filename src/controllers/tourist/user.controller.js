import { StatusCodes } from "http-status-codes";
import { 
  updateSelectedCityService,
  addOrUpdateOrDeleteWishListService,
  toggleWishlistService
 } from "../../services/user/user.service.js";

export const updateSelectedCity = async (req, res) => {
  const user_id = req.user.id;
  const { city_id } = req.params;

  try {
    const result = await updateSelectedCityService(user_id, city_id);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Selected city updated successfully",
      data: result,
    });

  } catch (error) {
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: error.message || "Something went wrong",
      });
  }
};
export const addOrUpdateOrDeleteWishlist = async (req, res) => {
  const userId = req.user.id;
  const { name, wishlist_id } = req.body;

  try {
    const result = await addOrUpdateOrDeleteWishListService(
      userId,
      name,
      wishlist_id
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      ...result,
    });

  } catch (error) {
    return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};


export const toggleWishlist = async (req, res) => {
  const userId = req.user.id;
  const { tour_id } = req.params;
  const { wishlist_id = null } = req.body;

  try {

    if (!tour_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "tour_id is required",
      });
    }

    const result = await toggleWishlistService(userId, tour_id, wishlist_id);

    return res.status(StatusCodes.OK).json({
      success: true,
      ...result,
    });

  } catch (error) {

    return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Something went wrong",
    });

  }
};

