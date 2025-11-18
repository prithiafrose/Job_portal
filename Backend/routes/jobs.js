import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Job = sequelize.define("Job", {
  job_position: { type: DataTypes.STRING, allowNull: false },
  company_name: { type: DataTypes.STRING, allowNull: false },
  monthly_salary: { type: DataTypes.INTEGER, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  skills_required: { type: DataTypes.JSON, allowNull: false },
  logo_url: { type: DataTypes.STRING },
  // ADD THIS STATUS FIELD:
  status: {
    type: DataTypes.ENUM('pending', 'active', 'rejected', 'expired'),
    defaultValue: 'pending'
  }
});

export default Job;

