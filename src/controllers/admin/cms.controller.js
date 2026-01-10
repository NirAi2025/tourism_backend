import { StatusCodes } from "http-status-codes";
import constants from "../../config/constants.js";
import { allCms, cmsByIdOrSlug, createOrUpdateCms, deleteCms } from "../../services/cms/cms.service.js";

export const cmsPages = async (req, res) => {
    try {
        const cmsPages = await allCms();
        return res.status(StatusCodes.OK).json({
            success: true,
            data: cmsPages,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || constants.INTERNAL_SERVER_ERROR,
        });
    }
}

export const getCmsById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const cmsPage = await cmsByIdOrSlug({ id });
        if (!cmsPage) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Cms page not found",
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            data: cmsPage,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || constants.INTERNAL_SERVER_ERROR,
        });
    }
}

export const createOrUpdateCmsPage = async (req, res) => {
    try {
        const { id } = req.params;
        const cmsPage = await createOrUpdateCms(req.body, id);
        return res.status(StatusCodes.OK).json({
            success: true,
            data: cmsPage,
        });
    } catch (error) {
        
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || constants.INTERNAL_SERVER_ERROR,
        });
    }
}

export const deleteCmsPage = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCount = await deleteCms(id);
        if (deletedCount === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Cms page not found",
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Cms page deleted successfully",
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || constants.INTERNAL_SERVER_ERROR,
        });
    }
}
