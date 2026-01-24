import { existsSync, mkdirSync } from "fs";
import path from "path";

export const fileUploaderSingle = async (uploadDir, file) => {
  // Ensure directory exists
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  // Sanitize filename
  const safeName = file.name.replace(/\s+/g, "_");
  const newfileName = `${Date.now()}-${safeName}`;

  // Correct path joining
  const uploadPath = path.join(uploadDir, newfileName);

  // Debug logs
  console.log("UPLOAD DIR:", uploadDir);
  console.log("FINAL UPLOAD PATH:", uploadPath);

  // Move file
  await file.mv(uploadPath);

  return {
    originalFileName: file.name,
    newfileName,
  };
};
export const fileUploaderMultiple = async (path, file) => {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
  let imagesArr = [];
  for (let [key, val] of Object.entries(file)) {
    if (Array.isArray(val)) {
      for (let [iterator, value] of Object.entries(val)) {
        let newfileName = Date.now().toString() + value.name;
        let uploadPath = path + newfileName;
        await value.mv(uploadPath);
        imagesArr.push({ originalFileName: value.name, newfileName });
      }
    } else {
      let newfileName = Date.now().toString() + val.name;
      let uploadPath = path + newfileName;
      await val.mv(uploadPath);
      imagesArr.push({ originalFileName: val.name, newfileName });
    }
  }
  return imagesArr;
};
