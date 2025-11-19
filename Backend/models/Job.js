// models/Job.js
import { DataTypes, Op } from "sequelize";
import sequelize from "../config/db.js";

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
      { title: { [Op.like]: `%${query}%` } },
      { company: { [Op.like]: `%${query}%` } }
    ];
  }
  
  if (filters.location) {
    whereClause.location = { [Op.like]: `%${filters.location}%` };
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

export default Job;


