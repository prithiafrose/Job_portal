const db = require('../utils/db');

exports.getJobs = (req, res) => {
  let sql = 'SELECT * FROM jobs WHERE 1=1';
  const params = [];

  if (req.query.q) { sql += ' AND title LIKE ?'; params.push(`%${req.query.q}%`); }
  if (req.query.location) { sql += ' AND location LIKE ?'; params.push(`%${req.query.location}%`); }
  if (req.query.skills) { sql += ' AND skills LIKE ?'; params.push(`%${req.query.skills}%`); }
  if (req.query.minSalary) { sql += ' AND salary >= ?'; params.push(req.query.minSalary); }
  if (req.query.maxSalary) { sql += ' AND salary <= ?'; params.push(req.query.maxSalary); }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ jobs: results });
  });
};

exports.getJobById = (req, res) => {
  db.query('SELECT * FROM jobs WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Job not found' });
    res.json(results[0]);
  });
};

exports.applyJob = (req, res) => {
  const userId = req.user.id;
  const { jobId } = req.body;

  db.query('SELECT * FROM applied_jobs WHERE user_id=? AND job_id=?', [userId, jobId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(400).json({ error: 'Already applied' });

    db.query('INSERT INTO applied_jobs (user_id, job_id) VALUES (?, ?)', [userId, jobId], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: 'Applied successfully' });
    });
  });
};
