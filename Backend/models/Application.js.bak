// Backend/models/Application.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Job from "./Job.js";

const Application = sequelize.define(
  "Application",
  {
    job_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    cover_letter: DataTypes.TEXT,
    resume_path: DataTypes.STRING,
    status: { 
      type: DataTypes.ENUM('pending', 'reviewed', 'accepted', 'rejected'), 
      defaultValue: 'pending' 
    }
  },
  { tableName: "applications", timestamps: true }
);

Application.belongsTo(Job, { foreignKey: "job_id" });
Application.belongsTo(User, { foreignKey: "user_id" });

export default Application;
