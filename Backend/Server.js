
// Backend/index.js
<<<<<<< HEAD
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.js");
const sequelize = require("./config/db.js");
const uploadRoutes = require("./routes/upload.js");
const Job = require("./models/Job.js");
const jobRoutes = require("./routes/jobs.js");
const recruiterRoutes = require("./routes/recruiter.js");
const applicationsRoutes = require("./routes/applications.js");
const paymentRoutes = require("./routes/payment.js");
const adminRoutes = require("./routes/admin.js");
const path = require("path");
=======
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
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d




<<<<<<< HEAD
dotenv.config({ path: path.join(__dirname, '.env') });
=======
dotenv.config();
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d
const app = express();


app.use(express.json());
app.use(cors({
<<<<<<< HEAD
  origin: true,
=======
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"], // Allow both local dev URLs
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d
  credentials: true
}));

// Serve static files
const frontendUIPath = path.resolve(__dirname, '../FrontendUI');
const frontendJsPath = path.resolve(__dirname, '../frontend_js');

console.log(`Serving FrontendUI from: ${frontendUIPath}`);
console.log(`Serving frontend_js from: ${frontendJsPath}`);

app.use('/frontend_js', express.static(frontendJsPath)); // Serve frontend_js specific route first
app.use('/FrontendUI', express.static(frontendUIPath));
app.use(express.static(frontendUIPath)); // Serve FrontendUI at root

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/admin", adminRoutes);
app.use("/api/recruiter", recruiterRoutes);
<<<<<<< HEAD
app.use("/apply-job", applicationsRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/admin", adminRoutes);
=======
app.use("/api/profile", authMiddleware, profileRoutes);

// Serve uploads statically so resumes/images can be accessed
const uploadsDir = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsDir));
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d

// Start server after syncing DB
const PORT = process.env.PORT || 5001;
(async () => {
  try {
    await sequelize.sync({ alter: true }); // ✅ Sync database and alter tables to match models
    console.log("✅ Database synced successfully.");
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Unable to start server:", err);
  }
})();
