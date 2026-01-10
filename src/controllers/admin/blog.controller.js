import { StatusCodes } from "http-status-codes";
import constants from "../../config/constants.js";
import { fileUploaderSingle } from "../../utils/fileUpload.js";
import {
  allBlogTypesService,
  blogTypeByIdService,
  createOrUpdateBlogTypeService,
  deleteBlogTypeService,
  allBlogsService,
  blogByIdOrSlugService,
  createOrUpdateBlogService,
  deleteBlogService,
} from "../../services/blog/blog.service.js";

export const getAllBlogTypes = async (req, res) => {
    try {
        const blogTypes = await allBlogTypesService();
        return res.status(StatusCodes.OK).json({
            success: true,
            data: blogTypes,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || constants.INTERNAL_SERVER_ERROR,
        });
    }
};

export const getBlogTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const blogType = await blogTypeByIdService(id);
        if (!blogType) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Blog Type not found",
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            data: blogType,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || constants.INTERNAL_SERVER_ERROR,
        });
    }
}

export const createOrUpdateBlogType = async (req, res) => {
    try {
        const { id } = req.params;
        const blogType = await createOrUpdateBlogTypeService(req.body, id);
        return res.status(StatusCodes.OK).json({
            success: true,
            data: blogType,
        });
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || constants.INTERNAL_SERVER_ERROR,
        });
    }
}

export const deleteBlogType = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteBlogTypeService(id);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Blog Type deleted successfully",
        });
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || constants.INTERNAL_SERVER_ERROR,
        });
    }
};

export const getAllBlogs = async (req, res) => {
    try {
        const filters = req.query;
        const blogs = await allBlogsService(filters);
        return res.status(StatusCodes.OK).json({
            success: true,
            data: blogs,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || constants.INTERNAL_SERVER_ERROR,
        });
    }
};

export const getBlogByIdOrSlug = async (req, res) => {
    try {
        const { id, slug } = req.params;
        
        const blog = await blogByIdOrSlugService({ id, slug });
        if (!blog) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Blog not found",
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            data: blog,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || constants.INTERNAL_SERVER_ERROR,
        });
    }
}

export const createOrUpdateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        // Handle image upload
        let featureImage = '';
        if (req.files && req.files.image) {
            const fImage = await fileUploaderSingle("./src/public/uploads/blogs/", req.files.image);
            featureImage = fImage.newfileName;
        }
        req.body.featured_image = featureImage;
        const blog = await createOrUpdateBlogService(req.body, id);
        return res.status(StatusCodes.OK).json({
            success: true,
            data: blog,
        });
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || constants.INTERNAL_SERVER_ERROR,
        });
    }
}

export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCount = await deleteBlogService(id);
        if (deletedCount === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Blog not found",
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Blog deleted successfully",
        });
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || constants.INTERNAL_SERVER_ERROR,
        });
    }
};