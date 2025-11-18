// Backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET || "change_this";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const recruiterAuth = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ error: "Access denied. Recruiter role required." });
    }
    next();
  });
};
