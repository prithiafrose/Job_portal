// Backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import sequelize from "./config/db.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://127.0.0.1:5500",
  credentials: true
}));


// Routes
app.use("/api/auth", authRoutes);

// Start server after syncing DB
const PORT = process.env.PORT || 5001;
(async () => {
  try {
    await sequelize.sync({ alter: true }); // ✅ This will create mobile column if missing
    console.log("✅ Database synced successfully.");
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Unable to start server:", err);
  }
})();
