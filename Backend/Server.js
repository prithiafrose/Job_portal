
// Backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import sequelize from "./config/db.js";
import uploadRoutes from "./routes/upload.js";
import Job from "./models/Job.js";
import jobRoutes from "./routes/jobs.js";
import recruiterRoutes from "./routes/recruiter.js";
import adminRoutes from "./routes/admin.js";
import profileRoutes from "./routes/profileRoutes.js";
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
app.use("/jobs", jobRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/admin", adminRoutes);
app.use("/profile", profileRoutes);

// Start server after syncing DB
const PORT = process.env.PORT || 5001;
(async () => {
  try {
    await sequelize.sync(); // ✅ Sync database without altering existing tables
    console.log("✅ Database synced successfully.");
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Unable to start server:", err);
  }
})();
