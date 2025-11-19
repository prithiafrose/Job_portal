import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random()*1e9) + ext);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

const apply = [
  upload.single('resume'),
  async (req, res) => {
    try {
      const { job_id, cover_letter } = req.body;
      const user_id = req.user.id;

      if (!job_id) return res.status(400).json({ error: 'job_id required' });

      // Check if already applied
      const existing = await Application.findOne({ where: { job_id, user_id } });
      if (existing) {
        return res.status(400).json({ error: 'You have already applied for this job' });
      }

      const resume_path = req.file ? `/uploads/${req.file.filename}` : null;

      const newApp = await Application.create({
        job_id,
        user_id,
        cover_letter,
        resume_path,
        status: 'pending'
      });

      res.json({ success: true, id: newApp.id });
    } catch (err) {
      console.error("Apply Error:", err);
      res.status(500).json({ error: 'Server error' });
    }
  }
];

const getForJob = async (req, res) => {
  try {
    const job_id = req.params.jobId;
    // Ideally check if req.user is the recruiter who posted this job
    const apps = await Application.findAll({
      where: { job_id },
      include: [
        { model: User, attributes: ['id', 'username', 'email'] }
      ]
    });
    res.json({ applications: apps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const user_id = req.user.id;
    const apps = await Application.findAll({
      where: { user_id },
      include: [
        { model: Job, attributes: ['id', 'job_position', 'company_name', 'location'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ applications: apps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export { apply, getForJob, getMyApplications };
