import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Job = sequelize.define("Job", {
  job_position: { type: DataTypes.STRING, allowNull: false },
  company_name: { type: DataTypes.STRING, allowNull: false },
  monthly_salary: { type: DataTypes.INTEGER, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  skills_required: { type: DataTypes.TEXT, allowNull: false }, // store as comma-separated string
  logo_url: { type: DataTypes.STRING }, // optional
  posted_by: { type: DataTypes.INTEGER, allowNull: false }, // foreign key to User
});

export default Job;
