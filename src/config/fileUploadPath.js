import path from "path";
import { fileURLToPath } from "url";

// Needed for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base path: /var/www/html/tourism_backend/src/public/uploads
const UPLOAD_BASE_PATH = path.resolve(
  __dirname,
  "../public/uploads"
);

export const BASE_FILE_URL = `${process.env.API_URL}/public/uploads`;

export const IDENTITY_DOC_UPLOAD_PATH = path.join(
  UPLOAD_BASE_PATH,
  "identity-doc"
);

export const BLOG_UPLOAD_PATH = path.join(
  UPLOAD_BASE_PATH,
  "blogs"
);

export const GUIDE_LICENCE_UPLOAD_PATH = path.join(
  UPLOAD_BASE_PATH,
  "guide-licence"
);

export const INSURANCE_DOC_UPLOAD_PATH = path.join(
  UPLOAD_BASE_PATH,
  "insurance-doc"
);

export const PROFILE_IMG_UPLOAD_PATH = path.join(
  UPLOAD_BASE_PATH,
  "profile"
);
export const TOUR_IMG_UPLOAD_PATH = path.join(
  UPLOAD_BASE_PATH,
  "tour"
);

export const withFileUrl = (fileName, folder) => {
  if (!fileName) return null;
  if (fileName.startsWith("http")) return fileName;

  return `${BASE_FILE_URL}/${folder}/${fileName}`;
};



