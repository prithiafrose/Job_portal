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
    status: { type: DataTypes.STRING, defaultValue: 'pending' }
  },
  { tableName: "applications", timestamps: true }
);

Application.belongsTo(Job, { foreignKey: "job_id" });
Application.belongsTo(User, { foreignKey: "user_id" });

// Static methods
Application.createApplication = async ({ job_id, user_id, cover_letter, resume_path }) => {
  const application = await Application.create({
    job_id,
    user_id,
    cover_letter,
    resume_path
  });
  return application.id;
};

Application.getApplicationsForJob = async (job_id) => {
  return await Application.findAll({
    where: { job_id },
    include: [
      { model: User, attributes: ['username', 'email'] },
      { model: Job, attributes: ['job_position', 'company_name'] }
    ]
  });
};

Application.getRecruiterApplications = async (recruiter_id) => {
  return await Application.findAll({
    include: [
      { model: User, attributes: ['username', 'email'] },
      { 
        model: Job, 
        attributes: ['job_position', 'company_name'],
        where: { posted_by: recruiter_id }
      }
    ]
  });
};

Application.getRecentApplications = async (recruiter_id) => {
  return await Application.findAll({
    limit: 5,
    order: [['createdAt', 'DESC']],
    include: [
      { model: User, attributes: ['username', 'email'] },
      { 
        model: Job, 
        attributes: ['job_position', 'company_name'],
        where: { posted_by: recruiter_id }
      }
    ]
  });
};

export default Application;
