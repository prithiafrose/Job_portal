// Test with recruiter account
const API_BASE = "http://localhost:5001/api";

async function testRecruiterFlow() {
    console.log("=== Testing Recruiter Job Posting Flow ===\n");
    
    // 1. Try to login as recruiter or create one
    console.log("1. Testing recruiter login...");
    try {
        const loginResponse = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'recruiter@example.com',
                password: 'password123'
            })
        });
        
        const loginData = await loginResponse.json();
        console.log("Recruiter Login Status:", loginResponse.status);
        console.log("Recruiter Login Response:", loginData);
        
        if (loginResponse.ok && loginData.token) {
            console.log("✅ Recruiter login successful");
            await testJobPosting(loginData.token, loginData.user);
        } else {
            console.log("❌ Recruiter login failed, trying to register...");
            await registerRecruiter();
        }
    } catch (error) {
        console.error("❌ Network error:", error.message);
    }
}

async function registerRecruiter() {
    console.log("\n2. Registering new recruiter...");
    try {
        const registerResponse = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'testrecruiter',
                email: 'recruiter@example.com',
                mobile: '9876543210',
                password: 'password123',
                role: 'recruiter'
            })
        });
        
        const registerData = await registerResponse.json();
        console.log("Recruiter Registration Status:", registerResponse.status);
        console.log("Recruiter Registration Response:", registerData);
        
        if (registerResponse.ok && registerData.token) {
            console.log("✅ Recruiter registration successful");
            await testJobPosting(registerData.token, registerData.user);
        } else {
            console.log("❌ Recruiter registration failed:", registerData.error);
        }
    } catch (error) {
        console.error("❌ Registration error:", error.message);
    }
}

async function testJobPosting(token, user) {
    console.log("\n3. Testing job posting with recruiter account...");
    console.log("User role:", user.role);
    
    try {
        const jobData = {
            title: 'Senior Developer Position',
            company: 'Tech Company',
            location: 'Remote',
            type: 'Full-Time',
            salary: '80000',
            description: 'Looking for an experienced senior developer...'
        };
        
        const jobResponse = await fetch(`${API_BASE}/recruiter/jobs`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jobData)
        });
        
        const jobResult = await jobResponse.json();
        console.log("Job Posting Status:", jobResponse.status);
        console.log("Job Posting Response:", jobResult);
        
        if (jobResponse.ok) {
            console.log("✅ Job posted successfully by recruiter!");
        } else {
            console.log("❌ Job posting failed:", jobResult.error);
        }
    } catch (error) {
        console.error("❌ Job posting error:", error.message);
    }
}

// Run the test
testRecruiterFlow();