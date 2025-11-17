const db = require('../utils/db');

// Helper function to validate email
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Get profile
exports.getProfile = (req, res) => {
  db.query(
    'SELECT id, username, email, phone, photo, skills FROM users WHERE id = ?',
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results[0]);
    }
  );
};

// Update profile with validation
exports.updateProfile = (req, res) => {
  let { username, email, phone, skills, photo } = req.body;

  // ===== Validation =====
  if (!username || !email || !phone) {
    return res.status(400).json({ error: "Full Name, Email, and Phone are required." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  // Limit base64 photo size (~1MB)
  if (photo && photo.length > 1_000_000) {
    return res.status(400).json({ error: "Photo is too large. Max size 1MB." });
  }

  // Trim fields
  username = username.trim();
  email = email.trim();
  phone = phone.trim();
  skills = skills ? skills.trim() : "";

  // ===== Update DB =====
  db.query(
    'UPDATE users SET username=?, email=?, phone=?, skills=?, photo=? WHERE id=?',
    [username, email, phone, skills, photo, req.user.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Profile updated successfully!' });
    }
  );
};
