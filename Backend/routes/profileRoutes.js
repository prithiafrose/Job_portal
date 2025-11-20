// routes/profileRoutes.js
import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// GET PROFILE
router.get("/", async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ["password"] } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE PROFILE (username, email, mobile)
router.put("/", async (req, res) => {
  try {
    const { username, email, mobile } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (username) user.username = username;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// CHANGE PASSWORD
router.put("/password", async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(current_password, user.password);
    if (!match) return res.status(400).json({ error: "Current password is incorrect" });

    user.password = new_password;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

