import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || "change_this";
const tokenExpiry = process.env.TOKEN_EXPIRY || "7d";

export const register = async (req, res) => {
  try {
    const { username, email, mobile, password,role } = req.body;
    if (!username || !email || !mobile||!password)
      return res
        .status(400)
        .json({ error: "Name, email, mobile and password required" });

    const existing = await User.findOne({ where: { email } });
    if (existing)
      return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      mobile,
        role: role || "candidate", // <--- role is set here

      password: passwordHash
    });

    const token = jwt.sign(
      { id: user.id, email: user.email,role: user.role },
      jwtSecret,
      { expiresIn: tokenExpiry }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email,mobile:user.mobile,role: user.role},
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: tokenExpiry }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
