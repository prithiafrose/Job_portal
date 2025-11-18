import express from "express";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/profile-image", upload.single("image"), (req, res) => {
  res.json({
    imageUrl: req.file.path,
    message: "Uploaded successfully!"
  });
});

export default router;
