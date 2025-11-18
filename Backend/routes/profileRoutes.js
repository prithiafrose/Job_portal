const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const router = express.Router();

// GET PROFILE
router.get("/", async (req, res) => {
  const admin = await User.findOne({ where: { role: "admin" } });

  res.json(admin);
});

// UPDATE PROFILE
router.put("/", async (req, res) => {
  const { username, email, mobile } = req.body;

  const admin = await User.findOne({ where: { role: "admin" } });

  admin.username = username;
  admin.email = email;
  admin.mobile = mobile;

  await admin.save();

  res.json({ message: "Profile updated successfully" });
});

// CHANGE PASSWORD
router.put("/password", async (req, res) => {
  const { current_password, new_password } = req.body;

  const admin = await User.findOne({ where: { role: "admin" } });

  const match = bcrypt.compareSync(current_password, admin.password);

  if (!match)
    return res.status(400).json({ error: "Current password is incorrect" });

  admin.password = bcrypt.hashSync(new_password, 10);
  await admin.save();

  res.json({ message: "Password updated successfully" });
});

module.exports = router;
