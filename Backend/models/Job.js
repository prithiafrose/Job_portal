import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Job = sequelize.define("Job", {
  job_position: { type: DataTypes.STRING, allowNull: false },
  company_name: { type: DataTypes.STRING, allowNull: false },
  monthly_salary: { type: DataTypes.INTEGER, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  skills_required: { type: DataTypes.JSON, allowNull: false }, // store skills as array
  logo_url: { type: DataTypes.STRING }, // optional
});

export default Job;
