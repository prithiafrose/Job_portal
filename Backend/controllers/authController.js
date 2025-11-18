// Backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();
const jwtSecret = process.env.JWT_SECRET || "change_this";
const tokenExpiry = process.env.TOKEN_EXPIRY || "7d";

const register = async (req, res) => {
  try {
    const { username, email, mobile, password, role, redirect } = req.body;
    if (!username || !email || !mobile || !password)
      return res.status(400).json({ error: "All fields are required" });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ username, email, mobile, role: role || "student", password: passwordHash });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: tokenExpiry });

    const response = {
      token,
      user: { id: user.id, username: user.username, email: user.email, mobile: user.mobile, role: user.role }
    };

    // Include redirect URL if provided
    if (redirect) {
      response.redirect = redirect;
    }

    res.status(201).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, redirect } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: tokenExpiry });

    const response = { 
      token, 
      user: { id: user.id, username: user.username, email: user.email, mobile: user.mobile, role: user.role } 
    };

    // Include redirect URL if provided
    if (redirect) {
      response.redirect = redirect;
    }

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const me = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await User.findByPk(userId, { attributes: ["id", "username", "email", "mobile", "role"] });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const logout = async (req, res) => {
  try {
    // For JWT-based auth, logout is handled client-side by removing the token
    // We can optionally blacklist tokens if needed, but for now just return success
    res.json({ message: "Logout successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { register, login, me, logout };
