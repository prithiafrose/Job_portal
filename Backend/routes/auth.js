const express = require("express");
const { register, login, me, logout, checkEmailExistence, forgotPassword, resetPassword, updateProfile } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/check-email", checkEmailExistence);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", authMiddleware, me); // JWT required
router.put("/profile", authMiddleware, updateProfile); // Update profile
router.post("/logout", logout); // Logout endpoint

module.exports = router;
