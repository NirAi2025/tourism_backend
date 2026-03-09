import { StatusCodes } from "http-status-codes";
import { updateSelectedCityService } from "../../services/user/user.service.js";

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

