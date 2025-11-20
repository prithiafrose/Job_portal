import Job from "../models/Job.js";

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
     const { title = '', location = '' } = req.query;
      const { jobs } = await Job.searchJobs({
      filters: {
        title: title.trim(),     // only filter by title
        location: location.trim() // only filter by location
      },
      page: 1,
      limit: 100                // adjust limit as needed
    });
    // Return array directly for frontend
    res.json(jobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      type: job.type
    })));
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

