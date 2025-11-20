const User = require("../models/User");
const Job = require("../models/Job");
const { Op } = require("sequelize");

// Dashboard Statistics
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const students = await User.count({ where: { role: 'student' } });
    const recruiters = await User.count({ where: { role: 'recruiter' } });
    const admins = await User.count({ where: { role: 'admin' } });

    res.json({
      totalUsers,
      students,
      recruiters,
      admins
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getJobStats = async (req, res) => {
  try {
    const totalJobs = await Job.count();
    const activeJobs = await Job.count({ where: { status: 'active' } });
    const pendingJobs = await Job.count({ where: { status: 'pending' } });
    const expiredJobs = await Job.count({ where: { status: 'expired' } });

    res.json({
      totalJobs,
      activeJobs,
      pendingJobs,
      expiredJobs
    });
  } catch (error) {
    console.error("Error fetching job stats:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getPendingApprovals = async (req, res) => {
  try {
    const pendingCount = await Job.count({ 
      where: { status: 'pending' } 
    });

    res.json({
      pendingCount
    });
  } catch (error) {
    console.error("Error fetching pending approvals:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getRecentRegistrations = async (req, res) => {
  try {
    // Get registrations from last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentCount = await User.count({
      where: {
        createdAt: {
          [Op.gte]: oneWeekAgo
        }
      }
    });

    res.json({
      recentCount
    });
  } catch (error) {
    console.error("Error fetching recent registrations:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// User Management
const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const whereClause = role ? { role } : {};
    
    const users = await User.findAll({
      where: whereClause,
      attributes: ['id', 'username', 'email', 'mobile', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Prevent deleting self (optional but good practice)
    if (user.id === req.user.id) {
      return res.status(400).json({ error: "Cannot delete yourself" });
    }

    await user.destroy();
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Job Management
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      include: [
        { model: User, as: 'recruiter', attributes: ['username', 'email'] } // Assuming association exists
      ],
      order: [['createdAt', 'DESC']]
    });
    
    // If association doesn't exist, Sequelize might throw error or just ignore include.
    // Safe fallback:
    // const jobs = await Job.findAll({ order: [['createdAt', 'DESC']] });
    
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching all jobs:", error);
    // Fallback without include if it fails
    try {
      const jobs = await Job.findAll({ order: [['createdAt', 'DESC']] });
      res.json(jobs);
    } catch (retryError) {
      res.status(500).json({ error: "Server error" });
    }
  }
};

const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const job = await Job.findByPk(id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    
    job.status = status;
    await job.save();
    
    res.json({ success: true, job });
  } catch (error) {
    console.error("Error updating job status:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    
    await job.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { 
  getUserStats, 
  getJobStats, 
  getPendingApprovals, 
  getRecentRegistrations,
  getUsers,
  deleteUser,
  getAllJobs,
  updateJobStatus,
  deleteJob
};