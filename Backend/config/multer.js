import multer from "multer";
import pkg from "multer-storage-cloudinary";
const { CloudinaryStorage } = pkg;
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "job_portal",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });
export default upload;
