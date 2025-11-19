import User from "../models/User.js";
import Job from "../models/Job.js";
import { Op } from "sequelize";

// Dashboard Statistics
export const getUserStats = async (req, res) => {
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

export const getJobStats = async (req, res) => {
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

export const getPendingApprovals = async (req, res) => {
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

export const getRecentRegistrations = async (req, res) => {
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
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'mobile', 'role'] // Exclude password
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Server error" });
  }
};
