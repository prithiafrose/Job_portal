const Job = require('../models/Job');

const createJob = async (req, res) => {
  try {
    // Check if user has recruiter role
    if (req.user.role !== 'recruiter' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only recruiters can post jobs' });
    }

    const { title, company, location, type, salary, description } = req.body;
    console.log('Received job data:', { title, company, location, type, salary, description, posted_by: req.user.id });
    
    if (!title || !company) return res.status(400).json({ error: 'Title and company required' });

    const posted_by = req.user.id;
    // Map to actual database field names
    const jobData = { 
      job_position: title, 
      company_name: company, 
      location, 
      monthly_salary: parseInt(salary) || null, 
      skills_required: JSON.stringify([]), // Empty array for skills
      posted_by 
    };
    console.log('Creating job with mapped data:', jobData);
    
    const jobId = await Job.createJob(jobData);
    console.log('Job created successfully with ID:', jobId);
    
    res.json({ id: jobId });
  } catch (err) {
    console.error('Detailed error in createJob:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const listJobs = async (req, res) => {
  try {
    const { q, page = 1, limit = 10, type, location } = req.query;
    const { jobs, total } = await Job.searchJobs({
      query: q,
      page: Number(page),
      limit: Number(limit),
      filters: { type, location }
    });
    res.json({ jobs, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getJob = async (req, res) => {
  try {
    const job = await Job.getJobById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateJob = async (req, res) => {
  try {
    const id = req.params.id;
    const fields = req.body;
    await Job.updateJob(id, fields);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteJob = async (req, res) => {
  try {
    await Job.deleteJob(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createJob, listJobs, getJob, updateJob, deleteJob };
