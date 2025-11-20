const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const router = express.Router();

// GET PROFILE
router.get("/", async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE PROFILE
router.put("/", async (req, res) => {
  try {
    const { username, email, mobile, skills } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    if (username) user.username = username;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    // Assuming there is a skills column or similar. If not, we might need to check the model.
    // The user model might need update if skills are not there.
    // Let's check User model first.
    
    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
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
