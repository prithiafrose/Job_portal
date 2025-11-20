<<<<<<< HEAD
const { DataTypes, Op } = require("sequelize");
const sequelize = require("../config/db");
=======
// models/Job.js
import { DataTypes, Op } from "sequelize";
import sequelize from "../config/db.js";
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d

const Job = sequelize.define("Job", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: { 
    type: DataTypes.STRING, 
    allowNull: false
  },
  company: { 
    type: DataTypes.STRING, 
    allowNull: false
  },
  location: { 
    type: DataTypes.STRING, 
    allowNull: true
  },
  type: { 
    type: DataTypes.STRING, 
    allowNull: true
  },
  salary: { 
    type: DataTypes.STRING, 
    allowNull: true
  },
  description: { 
    type: DataTypes.TEXT, 
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'expired', 'rejected'),
    defaultValue: 'pending',
    field: 'status'
  },
  posted_by: { 
    type: DataTypes.INTEGER, 
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'jobs',
  timestamps: false // Use created_at in DB
});

// Static method to create job
Job.createJob = async function(jobData) {
  try {
    const job = await this.create(jobData);
    return job.id;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

// Static method to search jobs
Job.searchJobs = async function({ query, page, limit, filters }) {
  const offset = (page - 1) * limit;
  const whereClause = {};
  
  if (query) {
    whereClause[Op.or] = [
<<<<<<< HEAD
      { job_position: { [Op.like]: `%${query}%` } },
      { company_name: { [Op.like]: `%${query}%` } }
    ];
  }
  
  if (filters.type) {
    // Note: type field doesn't exist in current schema, but keeping for future use
    // whereClause.type = filters.type;
  }
  
=======
      { title: { [Op.like]: `%${query}%` } },
      { company: { [Op.like]: `%${query}%` } }
    ];
  }
  
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d
  if (filters.location) {
    whereClause.location = { [Op.like]: `%${filters.location}%` };
  }

  if (filters.minSalary) {
    whereClause.monthly_salary = { [Op.gte]: filters.minSalary };
  }

  if (filters.maxSalary) {
    whereClause.monthly_salary = { 
      ...whereClause.monthly_salary,
      [Op.lte]: filters.maxSalary 
    };
  }

  if (filters.skills) {
    whereClause.skills_required = { [Op.like]: `%${filters.skills}%` };
  }

  const { count, rows } = await this.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [['created_at', 'DESC']]
  });

  return { jobs: rows, total: count };
};

// Static method to get job by ID
Job.getJobById = async function(id) {
  return await this.findByPk(id);
};

// Static method to update job
Job.updateJob = async function(id, fields) {
  const [updatedRowsCount] = await this.update(fields, { where: { id } });
  return updatedRowsCount > 0;
};

// Static method to delete job
Job.deleteJob = async function(id) {
  const deletedRowsCount = await this.destroy({ where: { id } });
  return deletedRowsCount > 0;
};

<<<<<<< HEAD
module.exports = Job;
=======
export default Job;


>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d
