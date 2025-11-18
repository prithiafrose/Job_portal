import sequelize from "./config/db.js";
import Job from "./models/Job.js";
//import cloudinary from "./config/cloudinary.js"; // ✅ Import cloudinary
//import path from "path";

(async () => {
  try {
    await sequelize.sync();

    // Upload a logo to Cloudinary
    //const logo1 = await cloudinary.uploader.upload(path.join('assets', 'frontend_logo.png'));
    //const logo2 = await cloudinary.uploader.upload(path.join('assets', 'backend_logo.png'));

    await Job.create({
      job_position: "Frontend Developer",
      company_name: "HireWay",
      monthly_salary: 50000,
      location: "Dhaka",
      skills_required: ["JavaScript", "HTML", "CSS"],
 logo_url: "https://via.placeholder.com/150"    });

    await Job.create({
      job_position: "Backend Developer",
      company_name: "HireWay",
      monthly_salary: 60000,
      location: "Dhaka",
      skills_required: ["Node.js", "MySQL", "Express"],
 logo_url: "https://via.placeholder.com/150"    });

    console.log("✅ Jobs seeded with Cloudinary logos!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding jobs:", err);
    process.exit(1);
  }
})();
