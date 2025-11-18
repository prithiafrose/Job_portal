import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Application from "../models/Application.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');
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

      const resume_path = req.file ? `/uploads/${req.file.filename}` : null;
      const appId = await Application.createApplication({ job_id, user_id, cover_letter, resume_path });
      res.json({ id: appId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
];

const getForJob = async (req, res) => {
  try {
    const job_id = req.params.jobId;
    const apps = await Application.getApplicationsForJob(job_id);
    res.json({ applications: apps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getRecruiterApplications = async (req, res) => {
  try {
    const user_id = req.user.id;
    const apps = await Application.getRecruiterApplications(user_id);
    res.json({ applications: apps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getRecentApplications = async (req, res) => {
  try {
    const user_id = req.user.id;
    const apps = await Application.getRecentApplications(user_id);
    res.json({ applications: apps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    const user_id = req.user.id;

    const application = await Application.findOne({
      where: { id: applicationId },
      include: [{ model: Job, where: { posted_by: user_id } }]
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found or you dont have permission' });
    }

    await application.update({ status });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export { apply, getForJob, getRecruiterApplications, getRecentApplications, updateApplicationStatus };
