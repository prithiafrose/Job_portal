
// Backend/index.js
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




dotenv.config({ path: path.join(__dirname, '.env') });
const app = express();


app.use(express.json());
app.use(cors({
  origin: "http://127.0.0.1:5500",
  credentials: true
}));

// Serve static files from FrontendUI
app.use(express.static(path.join(__dirname, '../FrontendUI')));
app.use('/FrontendUI', express.static(path.join(__dirname, '../FrontendUI')));
app.use('/frontend_js', express.static(path.join(__dirname, '../frontend_js')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/jobs", jobRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/apply-job", applicationsRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/admin", adminRoutes);

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
