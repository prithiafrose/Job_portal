const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const envPath = path.join(__dirname, '.env');
const newPassword = process.argv[2];

if (!newPassword) {
    console.log("Usage: node Backend/update-email-password.js \"your-new-app-password\"");
    process.exit(1);
}

// Strip spaces from the new password just in case, as they are optional in usage but safer without
const cleanPassword = newPassword.replace(/\s/g, '');

try {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if EMAIL_PASS exists
    if (envContent.match(/^EMAIL_PASS=/m)) {
        // Replace existing
        envContent = envContent.replace(/^EMAIL_PASS=.*/m, `EMAIL_PASS=${cleanPassword}`);
    } else {
        // Append
        envContent += `\nEMAIL_PASS=${cleanPassword}`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log(`✅ Updated EMAIL_PASS in ${envPath}`);
    console.log(`(Spaces were removed: ${cleanPassword})`);

    // Now run the check script
    console.log("\nVerifying new configuration...");
    require('./check-email-config.js');

} catch (err) {
    console.error("Failed to update .env:", err);
}
