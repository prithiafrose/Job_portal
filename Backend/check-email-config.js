const nodemailer = require('nodemailer');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

console.log("Checking Email Configuration...");
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

if (!user) {
    console.log("❌ EMAIL_USER is missing in .env");
} else {
    console.log(`✅ EMAIL_USER is set: ${user}`);
}

if (!pass) {
    console.log("❌ EMAIL_PASS is missing in .env");
} else {
    const masked = pass.length > 4 ? pass.substring(0, 2) + '*'.repeat(pass.length - 4) + pass.substring(pass.length - 2) : '****';
    console.log(`✅ EMAIL_PASS is set (${pass.length} chars): ${masked}`);
    if (pass.includes(' ')) {
        console.log("⚠️  Warning: EMAIL_PASS contains spaces. Google App Passwords often contain spaces but nodemailer usually handles them. If it fails, try removing spaces.");
    }
    if (pass === 'abcd efgh ijkl mnop') {
        console.log("❌ Error: EMAIL_PASS appears to be the example placeholder 'abcd efgh ijkl mnop'. You must generate a real Google App Password.");
    }
}

if (user && pass) {
    console.log("\nAttempting to connect to Gmail SMTP...");
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
    });

    transporter.verify((error, success) => {
        if (error) {
            console.log("❌ Connection failed:");
            console.error(error);
            if (error.response && error.response.includes('535-5.7.8')) {
                console.log("\n💡 Tip: This error usually means:");
                console.log("  1. The password is incorrect.");
                console.log("  2. You are using your login password instead of an App Password.");
                console.log("  3. The email address does not match the password.");
            }
        } else {
            console.log("✅ Connection successful! Your credentials work.");
        }
    });
}
