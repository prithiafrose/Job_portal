const express = require("express");
const upload = require("../config/multer");

const router = express.Router();

router.post("/profile-image", upload.single("image"), (req, res) => {
  res.json({
    imageUrl: req.file.path,
    message: "Uploaded successfully!"
  });
});

module.exports = router;
