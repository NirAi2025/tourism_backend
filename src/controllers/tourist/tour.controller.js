import { StatusCodes } from "http-status-codes";
import constants from "../../config/constants.js";
import { tourAvailabilityAndPriceService } from "../../services/user/tour.service.js";
import { TOUR_IMG_UPLOAD_PATH } from "../../config/fileUploadPath.js";
import { fileUploaderSingle } from "../../utils/fileUpload.js";

export const tourAvailability = async (req, res) => {
  const { tour_id } = req.params;
  const { month, year } = req.query;

  try {
    const result = await tourAvailabilityAndPriceService({
      tour_id,
      month,
      year,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: result.message,
      data: result.data,
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
