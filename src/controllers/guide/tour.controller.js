import { StatusCodes } from "http-status-codes";
import constants from "../../config/constants.js"
import { 
  tourCategoriesService,
  createTourStepOneService, 
  createTourStepTwoService,
  createTourStepThreeService,
  createTourStepFourService,
  createTourStepFiveService,
  createTourStepSixService,
  createTourStepSevenService,
  createTourStepEightService,
  createTourStepNineService,
  createTourStepTenService,
  createTourStepElevenService
} from "../../services/tour.service.js";
import {
  TOUR_IMG_UPLOAD_PATH
} from "../../config/fileUploadPath.js";
import { fileUploaderSingle } from "../../utils/fileUpload.js";

export const tourCategories = async (req, res) => {
  try {
    const { category_id = null, search = null } = req.query;

    const payload = {
      category_id: category_id ? Number(category_id) : null,
      search
    };

    const result = await tourCategoriesService(payload);

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: error.message || "Something went wrong",
      });
  }
};

export const createTourStepOne = async (req, res) => {
  try {
    const userId = req.user.id;
    req.body.guide_id = userId;
    const result = await createTourStepOneService(req.body);

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

export const createTourStepTwo = async (req, res) => {
  try {
    console.log("hereeee");
    
    const userId = req.user.id;
    console.log(userId);
    
    const result = await createTourStepTwoService(req.body);

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
export const createTourStepThree = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await createTourStepThreeService(req.body);

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

export const createTourStepFour = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await createTourStepFourService(req.body);

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

export const createTourStepFive = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await createTourStepFiveService(req.body);

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
export const createTourStepSix = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await createTourStepSixService(req.body);

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

export const createTourStepSeven = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await createTourStepSevenService(req.body);

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

export const createTourStepEight = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await createTourStepEightService(req.body);

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
export const createTourStepNine = async (req, res) => {
  try {
    const { body, files } = req;

    let coverImage = null;
    let galleryImages = [];

    // 1. Upload cover image (required)
    if (files?.cover_image) {
      const uploadedCover = await fileUploaderSingle(
        TOUR_IMG_UPLOAD_PATH,
        files.cover_image
      );
      coverImage = uploadedCover.newfileName;
    }

    // 2. Upload gallery images (optional)
    if (files?.gallery_images && files.gallery_images.length > 0) {
      for (const file of files.gallery_images) {
        const uploadedGallery = await fileUploaderSingle(
          TOUR_IMG_UPLOAD_PATH,
          file
        );
        galleryImages.push(uploadedGallery.newfileName);
      }
    }

    // 3. Call service
    const result = await createTourStepNineService({
      ...body,
      cover_image: coverImage,
      gallery_images: galleryImages,
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


export const createTourStepTen = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await createTourStepTenService(req.body);

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

export const createTourStepEleven = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await createTourStepElevenService(req.body);

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
