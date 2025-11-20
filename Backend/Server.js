
// Backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/jobs.js";
import sequelize from "./config/db.js";
import uploadRoutes from "./routes/upload.js";
import applicationRoutes from "./routes/applications.js";
import adminRoutes from "./routes/admin.js";
import recruiterRoutes from "./routes/recruiter.js";
import profileRoutes from "./routes/profileRoutes.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import path from "path";




dotenv.config();
const app = express();


app.use(express.json());
app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"], // Allow both local dev URLs
  credentials: true
}));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/admin", adminRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/profile", authMiddleware, profileRoutes);

// Serve uploads statically so resumes/images can be accessed
const uploadsDir = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsDir));

// Start server after syncing DB
const PORT = process.env.PORT || 5001;
(async () => {
  try {
    await sequelize.sync({ alter: true }); // ✅ Sync database without altering existing tables
    console.log("✅ Database synced successfully.");
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Unable to start server:", err);
  }
})();
