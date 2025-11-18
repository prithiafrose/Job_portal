// Simple test script to verify job posting with authentication
const API_BASE = "http://localhost:5001/api";

async function testCompleteFlow() {
    console.log("=== Testing Complete Job Posting Flow ===\n");
    
    // 1. Test login
    console.log("1. Testing login...");
    try {
        const loginResponse = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password123'
            })
        });
        
        const loginData = await loginResponse.json();
        console.log("Login Status:", loginResponse.status);
        console.log("Login Response:", loginData);
        
        if (loginResponse.ok && loginData.token) {
            console.log("✅ Login successful, token received");
            
            // 2. Test token validation
            console.log("\n2. Testing token validation...");
            const meResponse = await fetch(`${API_BASE}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${loginData.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const meData = await meResponse.json();
            console.log("Token Validation Status:", meResponse.status);
            console.log("Token Validation Response:", meData);
            
            if (meResponse.ok) {
                console.log("✅ Token is valid");
                
                // 3. Test job posting
                console.log("\n3. Testing job posting...");
                const jobData = {
                    title: 'Test Job Position',
                    company: 'Test Company',
                    location: 'Test Location',
                    type: 'Full-Time',
                    salary: '50000',
                    description: 'This is a test job posting for debugging purposes.'
                };
                
                const jobResponse = await fetch(`${API_BASE}/recruiter/jobs`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${loginData.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(jobData)
                });
                
                const jobResult = await jobResponse.json();
                console.log("Job Posting Status:", jobResponse.status);
                console.log("Job Posting Response:", jobResult);
                
                if (jobResponse.ok) {
                    console.log("✅ Job posted successfully");
                } else {
                    console.log("❌ Job posting failed:", jobResult.error);
                }
            } else {
                console.log("❌ Token validation failed:", meData.error);
            }
        } else {
            console.log("❌ Login failed:", loginData.error);
        }
    } catch (error) {
        console.error("❌ Network error:", error.message);
    }
}

// Run the test
testCompleteFlow();