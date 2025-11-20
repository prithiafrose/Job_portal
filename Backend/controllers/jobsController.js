<<<<<<< HEAD
const Job = require('../models/Job');
=======
import Job from "../models/Job.js";
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d

export const createJob = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter' && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Only recruiters can post jobs' });

    const { title, company, location, type, salary, description } = req.body;
    if (!title || !company) return res.status(400).json({ error: 'Title and company required' });

    const jobData = { title, company, location, type, salary, description, posted_by: req.user.id };
    const job = await Job.createJob(jobData);
    res.json({ id: job.id });
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

export const listJobs = async (req, res) => {
  try {
<<<<<<< HEAD
    const { q, page = 1, limit = 10, type, location, minSalary, maxSalary, skills } = req.query;
    const { jobs, total } = await Job.searchJobs({
      query: q,
      page: Number(page),
      limit: Number(limit),
      filters: { type, location, minSalary, maxSalary, skills }
    });
    res.json({ jobs, total, page: Number(page), limit: Number(limit) });
=======
    const { q, page = 1, limit = 10, location } = req.query;
    const { jobs } = await Job.searchJobs({ query: q, page: Number(page), limit: Number(limit), filters: { location } });

    // Return array directly for frontend
    res.json(jobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      type: job.type
    })));
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getJob = async (req, res) => {
  try {
    const job = await Job.getJobById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateJob = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, company, location, type, salary, description } = req.body;
    const fields = { title, company, location, type, salary, description };
    await Job.updateJob(id, fields);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteJob = async (req, res) => {
  try {
    await Job.deleteJob(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

<<<<<<< HEAD
module.exports = { createJob, listJobs, getJob, updateJob, deleteJob };
=======
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d
