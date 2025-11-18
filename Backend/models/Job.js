const { DataTypes, Op } = require("sequelize");
const sequelize = require("../config/db");

const Job = sequelize.define("Job", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  job_position: { 
    type: DataTypes.STRING, 
    allowNull: false,
    field: 'job_position'
  },
  company_name: { 
    type: DataTypes.STRING, 
    allowNull: false,
    field: 'company_name'
  },
  location: { 
    type: DataTypes.STRING, 
    allowNull: false,
    field: 'location'
  },
  monthly_salary: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    field: 'monthly_salary'
  },
  skills_required: { 
    type: DataTypes.TEXT, 
    allowNull: false,
    field: 'skills_required'
  },
  logo_url: { 
    type: DataTypes.STRING, 
    allowNull: true,
    field: 'logo_url'
  },
  posted_by: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    field: 'posted_by'
  }
}, {
  tableName: 'jobs',
  timestamps: true // This will use createdAt and updatedAt
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
      { job_position: { [Op.like]: `%${query}%` } },
      { company_name: { [Op.like]: `%${query}%` } }
    ];
  }
  
  if (filters.type) {
    // Note: type field doesn't exist in current schema, but keeping for future use
    // whereClause.type = filters.type;
  }
  
  if (filters.location) {
    whereClause.location = { [Op.like]: `%${filters.location}%` };
  }

  const { count, rows } = await this.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });

  return { jobs: rows, total: count };
};

// Static method to get job by ID
Job.getJobById = async function(id) {
  return await this.findByPk(id);
};

// Static method to update job
Job.updateJob = async function(id, fields) {
  const [updatedRowsCount] = await this.update(fields, {
    where: { id }
  });
  return updatedRowsCount > 0;
};

// Static method to delete job
Job.deleteJob = async function(id) {
  const deletedRowsCount = await this.destroy({
    where: { id }
  });
  return deletedRowsCount > 0;
};

module.exports = Job;
